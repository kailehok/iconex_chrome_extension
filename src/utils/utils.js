/* eslint-disable no-useless-escape */

import { coinRound as COIN_ROUND, currencyRound as CURRENCY_ROUND } from 'constants/index';
import i18n from 'constants/i18n'
import React from 'react';
import BigNumber from 'bignumber.js';
import { IS_V3 } from 'constants/config.js'

function charFreq( string ) {
    let value;
    let array_lengths = {}; // object
    // compute frequencies of each value
    for(let i = 0; i < string.length; i++) {
        value = string[i];
        if(value in array_lengths) {
            array_lengths[value]++;
        } else {
            array_lengths[value] = 1;
        }
    }
    return array_lengths;
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function numberWithCommas(x) {
  x = removeTrailingZeros(x)
	let parts = x.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}

function convertNumberToText(num, unit, isCoin) {
  const ROUND = isCoin ? COIN_ROUND : CURRENCY_ROUND;

  let roundNum = ROUND[unit];
  if (roundNum === undefined) {
    roundNum = 8;
  }

  if (unit === 'transaction') {
    num = new BigNumber(num);
    roundNum = 18;
    return numberWithCommas(num.toFixed(roundNum).toString())
  }

  if (typeof num === 'object') {
    if (num.eq(0)) {
      return '0'
    }
    return numberWithCommas(num.toFixed(roundNum))
  } else {
    num = new BigNumber(num);
    if (num.eq(0)) {
      return '0'
    }
    return numberWithCommas(num.toFixed(roundNum))
  }
}

function trimLeftZero(str) {
  if(!str) return str;
  if (str.startsWith("0.")) {
    return str;
  }

  if (str.startsWith("0") && str.indexOf("0.") !== -1) {
    if (str.includes(".") && /^[0]+$/.test(str.split(".")[0])) {
      return "0".concat(str.replace(/(^0+)/, ""));
    } else {
      return str.replace(/(^0+)/, "");
    }
  }

  if (!str.startsWith("0") && str.indexOf("0.") !== -1) {
    return str.replace(/(^0+)/, "");
  }

  return str.replace(/(^0+)/, "");
}

function removeTrailingZeros(value) {
    value = value.toString();

    if (value.indexOf('.') === -1) {
        return value;
    }

    while((value.slice(-1) === '0' || value.slice(-1) === '.') && value.indexOf('.') !== -1) {
        value = value.substr(0, value.length - 1);
    }
    return value;
}

function checkValueLength(value) {
  const round = 10;
  const point = 18;
  if (value.includes('.')) {
    if (value.split('.')[0].length > round || value.split('.')[1].length > point) {
      return false;
    } else {
        return true;
    }
  } else {
    if (value.length > round) {
      return false;
    } else {
      return true;
    }
  }
}

function customValueToTokenValue(balance, defaultDecimals, decimals) {
  if (typeof balance === 'object') {
    return balance.div(Math.pow(10, defaultDecimals-decimals))
  }
  return Number(balance) / Math.pow(10, defaultDecimals-decimals);
}

function tokenValueToCustomValue(balance, defaultDecimals, decimals) {
  if (typeof balance === 'object') {
    return balance.times(Math.pow(10, defaultDecimals-decimals)).toNumber();
  }
  return Number(balance) * Math.pow(10, defaultDecimals-decimals);
}

function calcTokenBalanceWithRate(balance, rate, defaultDecimals, decimals) {
  if (!rate) return null;
  if (typeof balance === 'object') {
    return balance.times(rate).div(Math.pow(10, defaultDecimals-decimals)).toNumber();
  }
  return balance * rate / Math.pow(10, defaultDecimals-decimals);
}

// https://ethereum.stackexchange.com/questions/12867/how-to-check-for-valid-contract-address-using-web3
function isAddress(address) {
    // function isAddress(address) {
    if (!/^(0x)[0-9a-f]{40}$/i.test(address)) {
        return false;
    } else {
        return true;
    }
}

// let isChecksumAddress = function (address) {
//     // Check each case
//     address = address.replace('0x','');
//     var addressHash = window.web3.sha3(address.toLowerCase());
//     for (var i = 0; i < 40; i++ ) {
//         // the nth letter should be uppercase if the nth digit of casemap is 1
//         if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
//             return false;
//         }
//     }
//     return true;
// }

function isIcxWalletAddress(address) {
    const addressLowerCase = address.toLowerCase();
    if (/^(hx)[0-9a-f]{40}$/.test(addressLowerCase)) {
        return true;
    } else {
        return false;
    }
}

function isIcxContractAddress(address) {
    const addressLowerCase = address.toLowerCase();
    if (/^(cx)[0-9a-f]{40}$/.test(addressLowerCase)) {
        return true;
    } else {
        return false;
    }
}

function isHex(hex) {
  if (hex === '') return true;
  return /^0x[0-9A-F]+$/i.test(hex)
}

function getCoinName(type) {
  if (!type) {
    return '코인'
  }

  switch (type) {
    case 'eth':
      return '이더리움';
    case 'icx':
      return '아이콘';
    default:
      return '코인'
  }
}

function getTypeText(type, language) {
  const I18n = i18n[language]
  switch (type) {
    case 'exchange':
      return I18n.exchange
    case 'transaction':
      return I18n.transfer
    default:
      return ''
  }
}

function check0xPrefix(string) {
  if (!string) return;
  string = string.toLowerCase();
  if(string.startsWith('0x')) {
    return string;
  } else {
    return '0x' + string;
  }
}

function checkHxPrefix(string) {
  if (!string) return;
  string = string.toLowerCase();
  if(string.startsWith('hx')) {
    return string;
  } else {
    return 'hx' + string;
  }
}

function checkCxPrefix(string) {
  if (!string) return;
  string = string.toLowerCase();
  if(string.startsWith('cx')) {
    return string;
  } else {
    return 'cx' + string;
  }
}

function delete0xPrefix(string) {
  if (!string) {
    return string;
  }
  string = string.toLowerCase();
  if(string.startsWith('0x')) {
    return string.slice(2);
  } else {
    return string;
  }
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}

function formatDate() { var d = new Date(), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear(); if (month.length < 2) month = '0' + month; if (day.length < 2) day = '0' + day; return [year, month, day].join('-'); }


/* https://gist.github.com/RHavar/a6511dea4d4c41aeb1eb */
function randomUint32() {
  if (window && window.crypto && window.crypto.getRandomValues && Uint32Array) {
      var o = new Uint32Array(1);
      window.crypto.getRandomValues(o);
      return o[0];
  } else {
      console.warn('Falling back to pseudo-random client seed');
      return Math.floor(Math.random() * Math.pow(2, 32));
  }
}

function calcMaxPageNum(total, rowNum) {
  if(!Number(total)) return 1;
  return Math.ceil(total / rowNum);
}

function nToBr(str) {
  const arr = str.split('\n').map( (line, i) => {
      return (<span style={{position: 'relative'}} key={i}>{line}<br/></span>);
  });
  return arr;
}

function checkLength(message) {
    if(!message) return 0

    let tmpStr;
    let tcount = 0;
    tmpStr = String(message);

    for (var k = 0; k < tmpStr.length; k++) {
        // [=91     \=92    ]=93    ^=94    {=123    |=124    }=125    ~=126 A~Z 65 ~ 90     a~z 97~122
        if (tmpStr.charCodeAt(k) === 91 || tmpStr.charCodeAt(k) === 92 ||
            tmpStr.charCodeAt(k) === 93 || tmpStr.charCodeAt(k) === 94 ||
            tmpStr.charCodeAt(k) === 123 || tmpStr.charCodeAt(k) === 124 ||
            tmpStr.charCodeAt(k) === 125 || tmpStr.charCodeAt(k) === 126 ||
            tmpStr.charCodeAt(k) >= 128) {
            tcount += 2;
        } else if (tmpStr.charCodeAt(k) !== 13) {
            tcount++;
        }
    }

    let tempArr = tmpStr.match(/\r?\n/g)
    if(tempArr){
        tcount += tempArr.length
    }
    return tcount
}

function makeAddressStr(address, type) {
  if (type === 'eth') {
    return check0xPrefix(address)
  }
  else if (type === 'icx') {
    return address
  }
  else {
    return address
  }
}

function onlyKorEngNum(text) {
  if (text === '') return true
  const pattern = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9|\s\*]+$/
  return pattern.test(text)
}

function isValidWalletName(name) {
  return onlyKorEngNum(name) && checkLength(name) <= 16
}

function sortTokensByDate(tokens) {
  return Object.values(tokens).sort((a, b) => {
    return a.createdAt - b.createdAt;
  })
}

function makeIcxRawTx(isContract, data) {
  let rawTx = {}
  if (!IS_V3) {
    const sendAmount = window.web3.toWei(new BigNumber(data.value), "ether");
    rawTx = {
      from: data.from,
      to: data.to,
      value: window.web3.toHex(sendAmount),
      fee: "0x2386f26fc10000",
      timestamp: (new Date()).getTime().toString() + '000'
    }
    return rawTx
  }

  if (isContract) {
    rawTx =  {
      from: data.from,
      to: data.contractAddress,
      version: "0x3",
      nid: '0x3',
      stepLimit: check0xPrefix(new BigNumber(data.txFeeLimit).toString(16)),
      timestamp: check0xPrefix(((new Date()).getTime() * 1000).toString(16)),
      dataType: 'call',
      data: {
          "method": data.methodName,
          "params": data.inputObj
      }
    };
    if (data.value) {
      const sendAmount = window.web3.toWei(new BigNumber(data.value), "ether");
      rawTx['value'] = window.web3.toHex(sendAmount)
    }
  }
  else {
    const sendAmount = window.web3.toWei(new BigNumber(data.value), "ether");
    rawTx = {
      from: data.from,
      to: data.to,
      value: window.web3.toHex(sendAmount),
      version: "0x3",
      nid: '0x3',
      stepLimit: check0xPrefix(new BigNumber(data.txFeeLimit).toString(16)),
      timestamp: check0xPrefix(((new Date()).getTime() * 1000).toString(16))
    }
    if (data.data) {
      rawTx['data'] = data.data;
      rawTx['dataType'] = 'message';
    }
  }

  return rawTx
}

function calcGasPrice(gasPrice) {
  if (!gasPrice) return 21
  const MIN_GWEI = new BigNumber(window.web3.toWei(11, "gwei"))
  const WeiPrice = gasPrice.lt(MIN_GWEI) ? MIN_GWEI : gasPrice
  const GweiPrice = window.web3.fromWei(WeiPrice, "gwei")
  const newGweiPrice = Number(GweiPrice.plus(10).toFixed(0))
  const result = newGweiPrice > 99 ? 99 : newGweiPrice
  return result
}

function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

function dataToHex(text) {

  let bytes = [];
  let convertedText = '';

  for (let i = 0; i < text.length; i++) {
      let originBytes = unescape(encodeURIComponent(text[i]));
      for (let j = 0; j < originBytes.length; j++) {
          bytes.push(originBytes[j].charCodeAt(0));
      }
  }

  let textToHexFormat = '%x'
  for (var i = 0; i < bytes.length; i++) {
      let byte = bytes[i];
      let hexByte = byte.toString(16);
      if (hexByte.length === 1) {
          hexByte = '0' + hexByte;
      }
      let char = textToHexFormat;
      char = char.replace(/%x/g, hexByte);
      convertedText += char;
  }

  return convertedText;
}

export {
  charFreq,
  isEmpty,
  numberWithCommas,
  convertNumberToText,
  sortTokensByDate,

  trimLeftZero,
  checkValueLength,
  customValueToTokenValue,
  tokenValueToCustomValue,
  calcTokenBalanceWithRate,
  isAddress,
  isIcxWalletAddress,
  isIcxContractAddress,
  isHex,
  getCoinName,
  getTypeText,
  check0xPrefix,
  checkCxPrefix,
  checkHxPrefix,
  delete0xPrefix,
  decimalToHex,
  formatDate,
  randomUint32,
  calcMaxPageNum,
  nToBr,
  checkLength,
  makeAddressStr,
  onlyKorEngNum,
  isValidWalletName,
  dataToHex,
  makeIcxRawTx,
  isDevelopment,
  calcGasPrice
}