import * as React from 'react';
import { sp, Web } from "@pnp/sp/presets/all";
import { IEmailProperties } from "@pnp/sp/sputilities";
import { IItemAddResult } from "@pnp/sp/items";
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect,
    RouteComponentProps
} from 'react-router-dom';
import * as moment from 'moment';
import TopMenu from './TopMenu';
import List from './List';
import Assessment from './Assessment';
import SigPanel from './SigPanel';
import { sigs_needed } from './definitions';

const mcc = 'color:lime;';

const baseUrl = window.location.href.split('.aspx')[0] + '.aspx';
const baseUrl_rel = baseUrl.split('sharepoint.com')[1];

let the_web;

const results_empty = {
    pct_ancillary: 0,
    pct_primary: 0,
    pct_total: 0,
    poss_ancillary: 0,
    poss_primary: 0,
    poss_total: 0,
    proj_name: null,
    score_ancillary: 0,
    score_primary: 0,
    score_total: 0
};

export interface AppProps { }
type RouteProps = AppProps & RouteComponentProps;

export interface AppState {
    sections: any;
    showPanel: boolean;
    sigs: any;
    user: any;
    proj_name?: string;
    redirect_to: any;
    items: any;
    results: any;
}

class App extends React.Component<RouteProps, AppState> {
    constructor(props: RouteProps) {
        super(props);
        this.state = {
            sections: 'loading',
            showPanel: false,
            sigs: sigs_needed,
            user: null,
            redirect_to: null,
            items: null,
            results: results_empty
        };
        this.handler_menus = this.handler_menus.bind(this);
        this.handler_panel = this.handler_panel.bind(this);
        this.handler_list = this.handler_list.bind(this);

    }

    public componentDidMount() {

        this.getWebUrl().then((w: string) => {
            the_web = Web(w);

            this.getData_currentUser().then((u: any) => {
                this.getData_item(null, null).then((item: any) => {
                    const checked_array = item && item.CheckedCriteria ? item.CheckedCriteria.split(',').map(icc => { return parseInt(icc); }) : null;
                    const proj_name = item ? item.Title : null;
                    const sigs = item && item.Signatures ? JSON.parse(item.Signatures) : sigs_needed;

                    this.getData_assessments_items().then(items => {
                        this.getData_assessments_fields().then(fields => {
                            this.getData_sections().then((sections: any) => {
                                this.getData_subsections().then((subsections: any) => {
                                    this.getData_criteria().then((criteria: any) => {

                                        const subs_with_criteria = subsections.map(sub => {
                                            sub.criteria = criteria.filter(c => c.SubsectionId === sub.Id);
                                            return sub;
                                        });
                                        Promise.all(subs_with_criteria).then(swc => {
                                            const sections_with_subs = sections.map(s => {
                                                s.subsections = subsections.filter(ss => ss.SectionId === s.Id);
                                                return s;
                                            });
                                            Promise.all(sections_with_subs).then(sws => {
                                                const subs_cleaner = subsections.map(ss => {
                                                    delete ss['odata.editLink'];
                                                    delete ss['odata.etag'];
                                                    delete ss['odata.id'];
                                                    delete ss['odata.type'];
                                                    delete ss['ID'];
                                                    ss.possScore = this.trimDecimals(ss.criteria.length * ss.ScorePerCriteria);
                                                });
                                                Promise.all(subs_cleaner).then(ssc => {
                                                    const sections_cleaner = sections.map(s => {
                                                        delete s['odata.editLink'];
                                                        delete s['odata.etag'];
                                                        delete s['odata.id'];
                                                        delete s['odata.type'];
                                                        delete s['ID'];
                                                        s.possScore = this.trimDecimals(s.subsections.reduce((a, b) => this.trimDecimals(a + b.possScore), 0));
                                                    });
                                                    Promise.all(sections_cleaner).then(sc => {
                                                        const criteria_cleaner = criteria.map(c => {
                                                            delete c['odata.editLink'];
                                                            delete c['odata.etag'];
                                                            delete c['odata.id'];
                                                            delete c['odata.type'];
                                                            delete c['ID'];
                                                            if (item) {
                                                                c.checked = checked_array ? checked_array.indexOf(c.Id) > -1 : false;
                                                            }
                                                        });
                                                        Promise.all(criteria_cleaner).then(cc => {

                                                            this.setState({
                                                                sections: sws,
                                                                user: u,
                                                                proj_name: proj_name,
                                                                sigs: sigs,
                                                                items: items
                                                            });

                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

            });
        });
    }

    public getWebUrl = () => new Promise(resolve => {
        sp.web.get().then(w => {
            resolve(w.Url);
        });
    })

    public getData_currentUser = () => new Promise(resolve => {
        the_web.currentUser
            .select('Id,IsSiteAdmin,LoginName,Title,UserPrincipalName,Email')
            .get().then(u => {
                const userData = {
                    id: u.Id,
                    name: u.Title || u.UserPrincipalName || u.LoginName,
                    email: u.Email || u.UserPrincipalName
                };
                resolve(userData);
            });
    })

    public getData_item = (the_iid, the_mode) => new Promise(resolve => {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = the_mode ? the_mode : urlParams.get('mode');

        if (mode && mode != 'new') {
            const iid = the_iid ? the_iid : urlParams.get('iid');

            if (iid) {

                the_web.lists.getByTitle('Assessments').items.getById(iid)
                    .select('CheckedCriteria', 'Signatures', 'Title', 'ID', 'ResultData')
                    .get().then(item => {
                        const results_str = item.ResultData;
                        const results_obj = results_str ? JSON.parse(results_str) : results_empty;
                        item.ResultData = results_obj;
                        resolve(item);
                    });
            }

            else resolve();

        }
        else resolve(null);
    })

    public getData_assessments_fields = () => new Promise(resolve => {
        the_web.lists.getByTitle('Assessments').fields
            .filter("Hidden eq false and ReadOnlyField eq false and InternalName ne 'ContentType'")
            .select('TypeAsString', 'InternalName', 'Title', 'Required', 'Choices', 'Description')
            .get().then(fields => {
                resolve(fields);
            });
    })

    public getData_assessments_items = () => new Promise(resolve => {
        the_web.lists.getByTitle('Assessments').items
            .select('CheckedCriteria', 'Signatures', 'Title', 'ID', 'ResultData')
            .get().then(Items => {
                resolve(Items);
            });
    })

    public getData_sections = () => new Promise(resolve => {
        the_web.lists.getByTitle('Sections').items
            .select('Id', 'Title')
            .get().then(items => {
                resolve(items);
            });
    })

    public getData_subsections = () => new Promise(resolve => {
        the_web.lists.getByTitle('Subsections').items
            .select('Id', 'Title', 'ScorePerCriteria', 'SectionId')
            .get().then(items => {
                resolve(items);
            });
    })

    public getData_criteria = () => new Promise(resolve => {
        the_web.lists.getByTitle('Criteria').items
            .select('Id', 'Title', 'Criteria', 'SubsectionId')
            .get().then(items => {
                resolve(items);
            });
    })

    public trimDecimals(num) {
        return Math.round(num * 100) / 100;
    }

    public handler_menus(event, button) {
        const urlParams = new URLSearchParams(window.location.search);

        if (button == 'new') {
            const redir = {
                pathname: baseUrl_rel + '/form',
                search: '?mode=new'
            };
            this.update_sections(null).then(new_sections => {
                this.setState({
                    redirect_to: redir,
                    results: results_empty,
                    sections: new_sections,
                    sigs: sigs_needed,
                    proj_name: null
                });
            });
        }

        else if (button == 'edit') {
            let url = new URL(baseUrl);
            let params = url.searchParams;
            params.set('mode', 'edit');

            const iid = urlParams.get('iid');
            params.set('iid', iid);

            url.search = params.toString();
            const new_url = url.toString();

            const redir = {
                pathname: baseUrl_rel + '/form',
                search: '?mode=edit&iid=' + iid
            };
            this.setState({ redirect_to: redir });
        }

        else if (button == 'save') {
            this.getCheckedCriteria().then((cc: any) => {
                const newItem = {
                    Title: this.state.proj_name,
                    CheckedCriteria: cc.toString(),
                    ResultData: JSON.stringify(this.state.results)
                };
                this.commitChanges(newItem, 'list');

            });
        }

        else if (button == 'signatures') {
            this.setState({ showPanel: true });
        }

        else if (button == 'cancel' || button == 'home') {
            this.go_home();
        }
    }

    public handler_projName(data) {
        this.setState({ proj_name: data });
    }

    public handler_checkbox(data) {
        let sections_copy = JSON.parse(JSON.stringify(this.state.sections));
        const mySection = sections_copy.filter(s => s.Id === data.sectionId)[0];
        const mySub = mySection.subsections.filter(ss => ss.Id === data.subId)[0];
        const myCriteria = mySub.criteria.filter(c => c.Id === data.criteriaId)[0];

        myCriteria.checked = data.checked;

        const sub_checked = mySub.criteria.filter(sc => sc.checked);
        const sub_checked_count = sub_checked.length;
        const sub_score = this.trimDecimals(mySub.ScorePerCriteria * sub_checked_count);

        mySub.score = sub_score;


        const sectionScore = mySection.subsections.reduce((a, b) => a + b.score || a, 0);

        mySection.score = sectionScore;

        const section_primary = sections_copy[0];
        const section_ancillary = sections_copy[1];

        const poss_primary = this.trimDecimals(section_primary.possScore || 0);
        const poss_ancillary = this.trimDecimals(section_ancillary.possScore || 0);
        const poss_total = this.trimDecimals(poss_primary + poss_ancillary);

        const score_primary = this.trimDecimals(section_primary.score || 0);
        const score_ancillary = this.trimDecimals(section_ancillary.score || 0);
        const score_total = this.trimDecimals(score_primary + score_ancillary);

        const pct_primary = this.trimDecimals(score_primary / poss_primary * 100 || 0);
        const pct_ancillary = this.trimDecimals(score_ancillary / poss_ancillary * 100 || 0);
        const pct_total = this.trimDecimals((pct_primary + pct_ancillary) / 2);

        const results = {
            poss_primary: poss_primary,
            poss_ancillary: poss_ancillary,
            poss_total: poss_total,

            score_primary: score_primary,
            score_ancillary: score_ancillary,
            score_total: score_total,

            pct_primary: pct_primary,
            pct_ancillary: pct_ancillary,
            pct_total: pct_total,

            proj_name: this.state.proj_name
        };

        this.setState({
            sections: sections_copy,
            results: results
        });

    }

    public handler_panel(data) {
        if (data == 'close') {
            this.setState({ showPanel: false });
        }
        else { // all signature buttons
            const { user, sigs } = this.state;
            const { name, id, email } = user;
            const new_sigs = JSON.parse(JSON.stringify(sigs));
            const this_sig = new_sigs.filter(s => s.role == data)[0];
            this_sig.signedBy = name;
            this_sig.signedById = id;
            this_sig.signedByEmail = email;
            this_sig.signedTime = moment().format('MM/DD/YYYY h:mm:ss a');

            this.getCheckedCriteria().then((cc: any) => {
                const newItem = {
                    Title: this.state.proj_name,
                    CheckedCriteria: cc.toString(),
                    Signatures: JSON.stringify(new_sigs)
                };
                this.commitChanges(newItem, 'STET');
            });

            this.setState({
                sigs: new_sigs
            }, () => {
                const all_sigs = new_sigs.every(s => {
                    return s.signedById;
                });
                if (all_sigs) this.send_email_allSigs();
            });
        }
    }

    public handler_list(button, iid) {

        const mode = button == 'view' ? 'display' : 'edit';

        const redir = {
            pathname: baseUrl_rel + '/form',
            search: '?mode=' + mode + '&iid=' + iid
        };

        this.getData_item(iid, mode).then((item: any) => {
            this.update_sections(item).then(new_sections => {
                const sigs = item.Signatures ? JSON.parse(item.Signatures) : sigs_needed;

                this.setState({
                    redirect_to: redir,
                    sections: new_sections,
                    results: item.ResultData,
                    proj_name: item.Title,
                    sigs: sigs
                });
            });
        });
    }

    public update_sections = (item) => new Promise(resolve => {
        const { sections } = this.state;

        if (item && item.CheckedCriteria) {
            const checkedCriteria = item.CheckedCriteria.split(',');

            sections.map(s => {
                s.subsections.map(ss => {
                    ss.criteria.map(c => {
                        c.checked = checkedCriteria.indexOf(c.Id + '') > -1;

                    });
                });
            });
        }
        else { // clear all criteria checkboxes
            sections.map(s => {
                s.subsections.map(ss => {
                    ss.criteria.map(c => {
                        c.checked = false;
                    });
                });
            });
        }

        resolve(sections);
    })

    public getCheckedCriteria = () => new Promise(resolve => {
        let checked_criteria = [];
        this.state.sections.map(s => {
            s.subsections.map(ss => {
                ss.criteria.map(c => {
                    if (c.checked) {
                        checked_criteria.push(c.Id);
                    }
                });
            });
        });
        resolve(checked_criteria);
    })

    public commitChanges(newItem, navTo) {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');

        if (!mode || mode == 'new') {
            this.addItem(newItem, navTo);
        }
        else {
            const iid = urlParams.get('iid');
            if (iid) {
                this.updateItem(newItem, iid, navTo);
            }
            else {
                console.log('No ID provided or invalid mode.');
            }
        }

    }

    public addItem(newItem, navTo) {
        this.getWebUrl().then((u: string) => {
            the_web = Web(u);
            the_web.lists.getByTitle('Assessments').items
                .add(newItem)
                .then((iar: IItemAddResult) => {
                    if (navTo && navTo == 'list') {
                        this.go_home();
                    }
                });
        });
    }

    public updateItem(newItem, iid, navTo) {
        this.getWebUrl().then((u: string) => {
            the_web = Web(u);
            the_web.lists.getByTitle('Assessments').items
                .getById(iid)
                .update(newItem)
                .then((iar: IItemAddResult) => {
                    if (navTo && navTo == 'list') {
                        this.go_home();
                    }
                });
        });
    }

    public go_home() {
        const redir = {
            pathname: baseUrl_rel + '/list'
        };
        this.getData_assessments_items().then(items => {
            this.setState({
                items: items,
                redirect_to: redir,
            });
        });
    }


    public send_email_allSigs() {
        const { proj_name, sigs } = this.state;
        const urlParams = new URLSearchParams(window.location.search);
        const iid = urlParams.get('iid');
        const url = baseUrl + '/form?mode=display&iid=' + iid;
        let to = [];
        if (baseUrl.indexOf('cocc.sharepoint.com') > -1) {
            to = ['lboehme@cocc.edu'];
        }
        else {
            to = ['ben@nutandem.com'];
        }
        sigs.map(s => {
            to.concat(s.signedByEmail);
        });
        const emailProps: IEmailProperties = {
            To: to,
            Subject: 'All Signatures Received',
            Body: `<div>
                    The last signature has been received for the project named "${proj_name}": 
                    <a href=${url}>${url}</a>
               </div>`
        };

        sp.utility.sendEmail(emailProps)/* .then(_ => {
        }) */;
    }

    public render() {

        if (this.state.redirect_to) {
            const { redirect_to } = this.state;
            this.setState({ redirect_to: null });
            return (
                <Router>
                    <Redirect
                        to={redirect_to}
                        push
                    />;
                </Router>
            );
        }

        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const { sections, showPanel, sigs, user, proj_name, items, results } = this.state;

        const el_menu = <TopMenu
            handler={this.handler_menus}
            mode={mode}
        />;

        const section_len = Array.isArray(sections) ? sections.length : 0;
        const result_data = results ? results : results_empty;
        const el_sections = <div className='assessmentWrap'>
            {<Assessment
                key={section_len}
                mode={mode}
                proj_name={proj_name}
                sections={sections}
                results={result_data}
                handler={this.handler_checkbox.bind(this)}
                handler_projName={this.handler_projName.bind(this)}
            />}
        </div>;

        const items_len = Array.isArray(items) ? items.length : 0;
        const el_list = <List
            key={items_len}
            items={items}
            results={results}
            handler={this.handler_list}
        />;

        const el_panel = user ? <SigPanel
            sigs={sigs}
            user={user}
            showPanel={showPanel}
            handler={this.handler_panel}
        /> : <></>;

        return (
            <div className='appWrap'>
                {el_menu}
                <Router>
                    <Switch>
                        <Route exact path={[baseUrl_rel, baseUrl_rel + '/list']}>
                            {el_list}
                        </Route>
                        <Route path={baseUrl_rel + '/form'}>
                            {el_sections}
                            {el_panel}
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;