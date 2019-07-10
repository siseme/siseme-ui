import axios from 'axios';

const get = (path, params) => {
    return axios.get(path, {params: params});
};

export const api = {
    getSidoList: () => {
        return get('http://15.164.200.252/dev/api/v1/regions/type/sido', {});
    },
    getGunguList: (sidoCode) => {
        return get('http://15.164.200.252/dev/api/v1/regions/type/gungu/like/' + sidoCode, {});
    },
    getDongList: (gunguCode) => {
        return get('http://15.164.200.252/dev/api/v1/regions/type/dong/like/' + gunguCode, {});
    },
    getAptList: (dongCode) => {
        return get('http://15.164.200.252/dev/api/v2/search/regions/' + dongCode + '/aptname', {});
    },
    getCount: (startDate, endDate, type, code, tradeType) => {
        let params = {
            "startDate": startDate,
            "endDate": endDate,
            "searchType": type,
            "regionCode": code,
            "tradeType": tradeType
        };
        return get('http://15.164.200.252/dev/api/v2/trade/count/', params);
    },
    getTradeRanks: (tradeType, startDate, endDate, type, code) => {
        let params = {
            "startDate": startDate,
            "endDate": endDate,
            "searchType": type,
            "regionCode": code
        };
        return get('http://15.164.200.252/dev/api/v2/' + tradeType + '/ranks/', params);
    },
    getDealsList: (startDate, endDate, type, name, code, pageNo, size, sortType, orderType, areaType, isNewData, tradeType) => {
        let params = {
            "startDate": startDate,
            "endDate": endDate,
            "searchType": type,
            "regionName": name,
            "regionCode": code,
            "sortType": sortType,
            "orderType": orderType,
            "areaType": areaType,
            "isNewData": isNewData,
            "tradeType": tradeType,
            "pageNo": pageNo,
            "size": size
        };
        return get('http://15.164.200.252/dev/api/v2/trade/', params);
    },
    query: (keyword) => {
        let params = {
            "keyword": keyword
        };
        return get('http://15.164.200.252/dev/api/v2/search/regions/', params);
    },
};