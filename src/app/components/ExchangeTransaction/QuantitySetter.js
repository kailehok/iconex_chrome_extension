import React, { Component } from 'react';
import { ComboBox } from 'app/components/'
import { TxFeeAndDataContainer, CalculationTableContainer } from 'app/containers/'
import { isEmpty, checkValueLength, trimLeftZero } from 'utils/utils'
import withLanguageProps from 'HOC/withLanguageProps';
import { IS_V3 } from 'constants/config'
import { walletCoinTypeSelector } from 'redux/helper/walletSelector'
import { makeEthRawTx } from 'redux/helper/walletUtils'

const INIT_STATE = {
//  currencyIndex: 0,
//  isFullBalance: false,
}

@withLanguageProps
class QuantitySetter extends Component {

  constructor(props) {
    super(props);
    this.state = INIT_STATE;
    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  componentWillReceiveProps(nextProps) {
    const { selectedAccount } = nextProps;

    if(this.props.totalResultLoading !== nextProps.totalResultLoading && !nextProps.totalResultLoading && selectedAccount) {
      this.props.setCalcData();
    }
  }

  handleInputChange = (e) => {
    if (!isNaN(e.target.value) && checkValueLength(e.target.value) && !e.target.value.includes("+") && !e.target.value.includes("-")) {
      this.props.setCoinQuantity(e.target.value);
      this.props.toggleFullBalance(false);
      this.getTxFeeInfo();
    }
  }

  getTxFeeInfo = () => {
    const { isToken } = this.props
    if (isToken && walletCoinTypeSelector() === 'eth') {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        const rawTx = makeEthRawTx()
        delete rawTx.chainId;
        delete rawTx.gasLimit;
        this.props.getTxFeeInfo(rawTx)
      }, 500)
    }
  }

  handleInputBlur = () => {
    this.props.setCoinQuantity(trimLeftZero(this.props.coinQuantity));
    this.props.setCoinQuantityError();
  }

  toggleCheckBox = (balance) => {

    let {
      isLoggedIn,
      isFullBalance
    } = this.props;

    if(!isLoggedIn) {
      return false
    }

    if(balance <= 0) {
      return false
    }

    if (!isFullBalance) {
      this.props.setCoinQuantity(balance)
      this.props.toggleFullBalance(true);
      this.getTxFeeInfo();
    }
    else {
      this.props.toggleFullBalance(false);
    }
  }

  changeCoin = (index) => {
    const { selectedAccount, isToken } = this.props;
    this.props.setSelectedWallet({
      account: selectedAccount,
      tokenId: index === selectedAccount ? '' : index
    })
    this.props.toggleFullBalance(false);
    this.props.setTxFeeLimit(isToken ? 55000 : 21000);
    this.props.setTxFeePrice(21);
    this.props.setCalcData();
  }

  render() {

    const {
      calcData,
      coinQuantity,
      coinQuantityError,
      selectedTokenId,
      selectedAccount,
      isLoggedIn,
      I18n,
      swapPage,
      isFullBalance,
      isContractPage
    } = this.props;

    if (isContractPage) {
      return (
        <div className="-group">
          <p className="title">{I18n.transferPageLabel1}</p>
          <input
          	type="text"
          	className={`txt-type-normal ${coinQuantityError && 'error'}`}
          	placeholder={I18n.transferPagePlaceholder1}
          	disabled={!isLoggedIn}
          	value={coinQuantity || ''}
          	onChange={this.handleInputChange}
          	onBlur={() => this.handleInputBlur()}
          />
          <p className="error">{I18n.error[coinQuantityError]}</p>
        </div>
      )
    }

    return (
      <div className={`quantity-holder ${calcData.coinType === 'icx' ? '' : 'ethereum'}`}>
        <div className="group">
          <span className="label">{swapPage ? I18n.swapToken.swapQuantity : I18n.transferPageLabel1}</span>
          <div className="won-group">
            <input
              type="text"
              className={`txt-type-normal ${coinQuantityError && 'error'}`}
              placeholder={swapPage ? I18n.swapToken.inputPlaceholder : I18n.transferPagePlaceholder1}
              disabled={!isLoggedIn}
              value={coinQuantity || ''}
              onChange={this.handleInputChange}
              onBlur={() => this.handleInputBlur()}
            />
            <div className="all">
              <span>{I18n.transferPageAllCheckBtn}</span>
              <input
                id="quantity-setter-cbox-01"
                className="cbox-type"
                type="checkbox"
                name=""
                disabled={!isLoggedIn}
                checked={isFullBalance}
              />
              <label htmlFor="quantity-setter-cbox-01" className="_img" onClick={()=>{isLoggedIn && this.toggleCheckBox(calcData.totalBalance)}}></label>
            </div>
            {!swapPage ? (
                <ComboBox
                  disabled={!isLoggedIn}
                  list={!isEmpty(calcData) ? calcData.coinTypeObj : {}}
                  index={selectedTokenId || selectedAccount}
                  setIndex={this.changeCoin}
                />
            ) : (
              <ComboBox
                disabled={true}
                list={{ICX: "ICX"}}
                index={"ICX"}
                setIndex={()=>{}}
                noArrow={true}
              />
            )}
            {isLoggedIn && (<span className="won">{calcData.sendQuantityWithRate !== '-' && <i className="_img"></i>}<em>{calcData.sendQuantityWithRate || 0 }</em> <em>USD</em></span>)}
            <p className="error">{I18n.error[coinQuantityError]}</p>
          </div>
        </div>
    {
      (isLoggedIn && !swapPage) && (calcData.coinType === 'icx' ? IS_V3 : true) && (
        <TxFeeAndDataContainer />
      )
    }
    {
      isLoggedIn && (
        <CalculationTableContainer
          swapPage={swapPage}
        />
      )
    }
      </div>
    )
  }
}

export default QuantitySetter;