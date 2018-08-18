import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Header } from './components';
import { CreateAccount, ArticlePage, AddArticle, EditArticle, Articles, Login } from './views';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Header />
                <Switch>
                    <Route exact path="/" component={Articles}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/create-account" component={CreateAccount}></Route>
                    <Route path="/article/add" component={AddArticle}></Route>
                    <Route path="/article/edit/:uniqueId" component={EditArticle}></Route>
                    <Route path="/article/:uniqueId" component={ArticlePage}></Route>
                </Switch>
            </div>
        );
    }
}

export default App;
