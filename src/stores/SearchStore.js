import {action, computed, observable} from 'mobx';
import {asyncAction} from 'mobx-utils';
import {api} from "../api";
import moment from "moment";

const ALL = {
    name: '전체',
    code: -1
};

export default class SearchStore {
    // common
    @observable backUrl = '/';

    // region
    @observable sidoList = [];
    @observable sido = ALL;
    @observable gunguList = [];
    @observable gungu = ALL;
    @observable dongList = [];
    @observable dong = ALL;
    @observable aptList = [];
    @observable apt = ALL;
    @observable searchList = [];
    @observable startDate = moment().subtract(1, 'months');
    @observable endDate = moment();

    // trade
    @observable isDataLoding = false;
    @observable isRankingLoding = false;
    @observable dealsList = [];
    @observable resultCount = {
        newItemCount: 0,
        maxPriceCount: 0
    };
    @observable rankResult = [];
    @observable pageNo = 0;
    @observable size = 100;
    @observable sortType = 'date';
    @observable orderType = 'desc';
    @observable areaType = 0;
    @observable isNewData = false;
    @observable tradeType = 'trade';

    constructor(root) {
        this.root = root;
        this.load();
    }

    @computed
    get getRegion() {
        if (this.apt.code !== -1) {
            return this.apt;
        } else if (this.dong.code !== -1) {
            return this.dong;
        } else if (this.gungu.code !== -1) {
            return this.gungu;
        } else if (this.sido.code !== -1) {
            return this.sido;
        } else {
            return ALL;
        }
    };

    @computed
    get getRegionName() {
        if (this.apt.code !== ALL.code) {
            return this.sido.name + ' ' + this.gungu.name + ' ' + this.dong.name + ' ' + this.apt.name;
        } else if (this.dong.code !== ALL.code) {
            return this.sido.name + ' ' + this.gungu.name + ' ' + this.dong.name;
        } else if (this.gungu.code !== ALL.code) {
            return this.sido.name + ' ' + this.gungu.name;
        } else if (this.sido.code !== ALL.code) {
            return this.sido.name;
        }
    };

    @computed
    get getKeywordName() {
        if (this.dong.code !== ALL.code) {
            return this.sido.name + ' ' + this.gungu.name + ' ' + this.dong.name;
        } else if (this.gungu.code !== ALL.code) {
            return this.sido.name + ' ' + this.gungu.name;
        } else if (this.sido.code !== ALL.code) {
            return this.sido.name;
        }
    };

    @computed
    get getContents() {
        return this.dealsList.contents;
    };

    @computed
    get hasMore() {
        return this.pageNo < this.dealsList.totalPages
    };

    @computed
    get getMaxPriceDealsSize() {
        return this.dealsList.contents ? this.dealsList.contents.filter(x => x.price > x.pastMaxPrice).length : 0;
    };

    @action
    handleTradeType = (tradeType) => {
        this.tradeType = tradeType;
        this.getDealsList();
    };

    @action
    handleRangeDate = (range) => {
        this.endDate = new moment();
        this.startDate = new moment().subtract(range, 'months');
        this.getDealsList();
    };

    @action
    handleStartDate = (date) => {
        this.startDate = new moment(date);
        this.getDealsList();
    };

    @action
    handleEndDate = (date) => {
        this.endDate = new moment(date);
        this.getDealsList();
    };

    @action
    handleSort = (sort) => {
        this.sortType = sort;
    };

    @action
    setBackUrl = (url) => {
        this.backUrl = url;
    };

    @action
    setSido = (sido) => {
        this.sido = sido;
    };

    @action
    setGungu = (gungu) => {
        this.gungu = gungu;
    };

    @action
    setDong = (dong) => {
        this.dong = dong;
    };

    @action
    setApt = (apt) => {
        this.apt = apt;
    };

    @action
    nextPageNo = () => {
        this.pageNo += 1;
    };

    @asyncAction
    async* handleRegion(region) {
        if (!region || region.code === -1) {
            return;
        }
        yield this.getSidoList();
        let sido = this.sidoList.filter(x => x.code === region.code.substring(0, 2))[0];
        this.sido = sido ? sido : ALL;

        yield this.getGunguList();
        let gungu = this.gunguList.filter(x => x.code === region.code.substring(0, 5))[0];
        this.gungu = gungu ? gungu : ALL;

        yield this.getDongList();
        let dong = this.dongList.filter(x => x.code === region.code.substring(0, 9))[0];
        this.dong = dong ? dong : ALL;

        this.aptList = [];
        this.apt = ALL;
    };

    @asyncAction
    async* appendDealsList() {
        if (this.getRegion !== null && this.hasMore) {
            let region = this.getRegion;
            let result = yield api.getDealsList(
                this.startDate.format('YYYYMM'),
                this.endDate.format('YYYYMM'),
                region.type,
                region.name,
                region.code,
                this.pageNo,
                this.size,
                this.sortType,
                this.orderType,
                this.areaType,
                this.isNewData,
                this.tradeType)
                .then(result => result.data);
            this.nextPageNo();
            let dealsList = this.dealsList;
            dealsList.contents = dealsList.contents.concat(result.contents);
            this.dealsList = dealsList;
        }
    };

    @asyncAction
    async* getTradeRanks() {
        if (this.getRegion !== null) {
            this.isRankingLoding = true;
            this.resultCount = {
                newItemCount: 0,
                maxPriceCount: 0
            };
            let region = this.getRegion;
            let result = yield api.getTradeRanks(
                this.tradeType,
                this.startDate.format('YYYYMM'),
                this.endDate.format('YYYYMM'),
                region.type,
                region.code)
                .then(result => result.data);
            this.rankResult = result;
            this.isRankingLoding = false;
        }
    };

    @asyncAction
    async* getCount() {
        if (this.getRegion !== null) {
            this.resultCount = {
                newItemCount: 0,
                maxPriceCount: 0
            };
            let region = this.getRegion;
            let result = yield api.getCount(
                this.startDate.format('YYYYMM'),
                this.endDate.format('YYYYMM'),
                region.type,
                region.code,
                this.tradeType)
                .then(result => result.data);
            this.resultCount = result;
        }
    };

    @asyncAction
    async* getDealsList() {
        if (this.getRegion !== null) {
            this.isDataLoding = true;
            this.getCount();
            this.getTradeRanks();
            this.save();
            this.pageNo = 0;
            this.dealsList = [];
            let region = this.getRegion;
            let result = yield api.getDealsList(
                this.startDate.format('YYYYMM'),
                this.endDate.format('YYYYMM'),
                region.type,
                region.name,
                region.code,
                this.pageNo,
                this.size,
                this.sortType,
                this.orderType,
                this.areaType,
                this.isNewData,
                this.tradeType)
                .then(result => result.data);
            this.nextPageNo();
            this.dealsList = result;
            this.isDataLoding = false;
        }
    };

    @asyncAction
    async* regionSearch(keyword) {
        if (keyword === '' || !keyword) {
            return;
        }
        this.searchList = yield api.query(keyword).then(result => result.data);
    };

    @asyncAction
    async* getSidoList() {
        this.initSido();
        this.sidoList = yield api.getSidoList().then(result => result.data);
    };

    @asyncAction
    async* getGunguList() {
        this.initGungu();
        this.gunguList = yield api.getGunguList(this.sido.code).then(result => result.data);
    };

    @asyncAction
    async* getDongList() {
        this.initDong();
        this.dongList = yield api.getDongList(this.gungu.code).then(result => result.data);
    };

    @asyncAction
    async* getAptList() {
        this.apt = ALL;
        this.aptList = yield api.getAptList(this.dong.code).then(result => result.data);
    };

    @asyncAction
    async* load() {
        this.getSidoList();
        let params = localStorage.getItem('search.params.list');
        if (params && params.length > 0) {
            let parseJson = JSON.parse(params)[0];
            if(parseJson.region.code === -1) {
                return;
            }
            yield this.handleRegion(parseJson.region);
            this.startDate = new moment(parseJson.startDate);
            this.endDate = new moment(parseJson.endDate);
            yield this.getDealsList();
        }
    };

    initDong = () => {
        this.dongList = [];
        this.dong = ALL;
        this.aptList = [];
        this.apt = ALL;
    };

    initGungu = () => {
        this.gunguList = [];
        this.gungu = ALL;
        this.dongList = [];
        this.dong = ALL;
        this.aptList = [];
        this.apt = ALL;
    };

    initSido = () => {
        this.sidoList = [];
        this.sido = ALL;
        this.gunguList = [];
        this.gungu = ALL;
        this.dongList = [];
        this.dong = ALL;
        this.aptList = [];
        this.apt = ALL;
    };

    save = () => {
        let params = {
            'region': this.getRegion,
            'startDate': this.startDate,
            'endDate': this.endDate,
            'searchDate': new moment()
        };
        let searchParamsList = localStorage.getItem('search.params.list');
        if (!searchParamsList) {
            searchParamsList = [];
        } else {
            searchParamsList = JSON.parse(searchParamsList);
        }
        searchParamsList.push(params);
        searchParamsList = searchParamsList.sort(function (a, b) {
            let keyA = new Date(a.searchDate),
                keyB = new Date(b.searchDate);
            // Compare the 2 dates
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
        searchParamsList = this.getUniqueObjectArray(searchParamsList);
        localStorage.setItem('search.params.list', JSON.stringify(searchParamsList));
    };

    getUniqueObjectArray = (array, key) => {
        return array.filter((item, i) => {
            return array.findIndex((item2, j) => {
                return item.region.code === item2.region.code;
            }) === i;
        });
    }
}