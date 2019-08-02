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
    @observable isChartLoading = false;
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
    // numberOfTradeRanks numberOfNewHighPriceRanks unitPriceRanks
    @observable rankType = 'numberOfTradeRanks';
    @observable chartType = 'count';
    @observable newItemFilter = false;
    @observable maxPriceFilter = false;

    //
    @observable chart = {priceData: [], countData: []};

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
        } else {
            return null;
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
        else {
            return null;
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

    @asyncAction
    async* redirect(fullName, startDate, endDate, tradeType) {
        let region = yield api.getRegionByFullName(fullName).then(result => result.data);
        yield this.handleRegion(region);
        this.startDate = new moment(startDate);
        this.endDate = new moment(endDate);
        this.tradeType = tradeType;
        this.getDealsList();
    };

    @action
    handleChartType = (value) => {
        this.chartType = value;
    };

    @action
    handleNoneFilter = () => {
        this.maxPriceFilter = false;
        this.newItemFilter = false;
    };

    @action
    handleMaxPriceFilter = (maxPriceFilter) => {
        this.maxPriceFilter = maxPriceFilter;
        this.newItemFilter = false;
    };

    @action
    handleNewItemFilter = (newItemFilter) => {
        this.maxPriceFilter = false;
        this.newItemFilter = newItemFilter;
    };

    @action
    handleRankType = (rankType) => {
        this.rankType = rankType;
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
            this.handleRankType('numberOfTradeRanks');
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
            this.getStats();
            this.handleNoneFilter();
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

    @asyncAction
    async* getRegionByFullName(fullName) {
        let region = yield api.getRegionByFullName(fullName).then(result => result.data);
        yield this.handleRegion(region);
    }

    @asyncAction
    async* getStats() {
        this.isChartLoading = true;
        let result = yield api.getCountStats(this.tradeType, this.getRegion.code, this.endDate.format('YYYYMM')).then(res => res.data);
        let type1List = result.type1TradeStatsList;
        let type2List = result.type2TradeStatsList;
        let type3List = result.type3TradeStatsList;
        let type4List = result.type4TradeStatsList;
        let type5List = result.type5TradeStatsList;

        let totalDateList = type1List.map(x => x.date.slice(0, 4) + '-' + x.date.slice(4, 8) + '-01');
        if (totalDateList.length === 0) {
            totalDateList = type2List.map(x => x.date.slice(0, 4) + '-' + x.date.slice(4, 8) + '-01');
        }
        if (totalDateList.length === 0) {
            totalDateList = type3List.map(x => x.date.slice(0, 4) + '-' + x.date.slice(4, 8) + '-01');
        }
        if (totalDateList.length === 0) {
            totalDateList = type4List.map(x => x.date.slice(0, 4) + '-' + x.date.slice(4, 8) + '-01');
        }
        if (totalDateList.length === 0) {
            totalDateList = type5List.map(x => x.date.slice(0, 4) + '-' + x.date.slice(4, 8) + '-01');
        }
        totalDateList.unshift('날짜');

        let type1PriceList = type1List.map(x => x.sumMainPrice !== 0 ? (x.sumMainPrice / x.count).toFixed(0) : null);
        type1PriceList.unshift('초소형(49m²이하)');
        let type2PriceList = type2List.map(x => x.sumMainPrice !== 0 ? (x.sumMainPrice / x.count).toFixed(0) : null);
        type2PriceList.unshift('소형(49m²초과~60m²이하)');
        let type3PriceList = type3List.map(x => x.sumMainPrice !== 0 ? (x.sumMainPrice / x.count).toFixed(0) : null);
        type3PriceList.unshift('중형(60m²초과~85m²이하)');
        let type4PriceList = type4List.map(x => x.sumMainPrice !== 0 ? (x.sumMainPrice / x.count).toFixed(0) : null);
        type4PriceList.unshift('중대형(85m²초과~135m²이하)');
        let type5PriceList = type5List.map(x => x.sumMainPrice !== 0 ? (x.sumMainPrice / x.count).toFixed(0) : null);
        type5PriceList.unshift('대형(135m²초과)');

        let type0PriceList = [];
        for (let i = 1; i < totalDateList.length; i++) {
            let sum = 0;
            let sumCount = 0;
            if (type1PriceList[i]) {
                sum += type1PriceList[i] * 1;
                sumCount++;
            }
            if (type2PriceList[i]) {
                sum += type2PriceList[i] * 1;
                sumCount++;
            }
            if (type3PriceList[i]) {
                sum += type3PriceList[i] * 1;
                sumCount++;
            }
            if (type4PriceList[i]) {
                sum += type4PriceList[i] * 1;
                sumCount++;
            }
            if (type5PriceList[i]) {
                sum += type5PriceList[i] * 1;
                sumCount++;
            }
            sum = sum !== 0 ? sum / sumCount : 0;
            type0PriceList.push(sum.toFixed(0));
        }
        type0PriceList.unshift('전체평균');

        let type1CountList = type1List.map(x => x.count);
        type1CountList.unshift('초소형(49m²이하)');
        let type2CountList = type2List.map(x => x.count);
        type2CountList.unshift('소형(49m²초과~60m²이하)');
        let type3CountList = type3List.map(x => x.count);
        type3CountList.unshift('중형(60m²초과~85m²이하)');
        let type4CountList = type4List.map(x => x.count);
        type4CountList.unshift('중대형(85m²초과~135m²이하)');
        let type5CountList = type5List.map(x => x.count);
        type5CountList.unshift('대형(135m²초과)');

        let type0CountList = [];
        for (let i = 1; i < totalDateList.length; i++) {
            let sum = 0;
            if (type1CountList[i]) {
                sum += type1CountList[i] * 1;
            }
            if (type2CountList[i]) {
                sum += type2CountList[i] * 1;
            }
            if (type3CountList[i]) {
                sum += type3CountList[i] * 1;
            }
            if (type4CountList[i]) {
                sum += type4CountList[i] * 1;
            }
            if (type5CountList[i]) {
                sum += type5CountList[i] * 1;
            }
            type0CountList.push(sum);
        }
        type0CountList.unshift('총 거래건수');

        let columns = [];
        columns.push(totalDateList);
        columns.push(type1PriceList);
        columns.push(type2PriceList);
        columns.push(type3PriceList);
        columns.push(type4PriceList);
        columns.push(type5PriceList);
        columns.push(type0PriceList);

        let countColumns = [];
        countColumns.push(totalDateList);
        countColumns.push(type1CountList);
        countColumns.push(type2CountList);
        countColumns.push(type3CountList);
        countColumns.push(type4CountList);
        countColumns.push(type5CountList);
        countColumns.push(type0CountList);

        this.chart = {priceData: columns, countData: countColumns};
        this.isChartLoading = false;
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