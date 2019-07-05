import React from 'react';

import DealsSearchContainer from "../deals/search/DealsSearchContainer";

function SearchContainer(props) {
    return (
        <React.Fragment>
            <DealsSearchContainer/>
            {/*
            <Switch>
                <Route path="/search/region" component={SelectContainer} history={props.history}/>
            </Switch>
*/}
        </React.Fragment>
    );
}

export default SearchContainer;
