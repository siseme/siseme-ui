import SearchStore from "./SearchStore";

class RootStore {
    constructor() {
        this.searchStore = new SearchStore(this);
    }
}

export default RootStore;