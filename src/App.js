import React, { Component } from 'react';
import './App.css';

const serviceLink = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRate: 'usd',
      ratesNames: ['usd', 'eur', 'bgn', 'aud', 'cad', 'chf', 'nzd'],
      //USD, EUR, AUD, CAD, CHF, NZD, BGN

      allData: [],
      selectedRateArr: [],
      isLoading: true,
      group1: [],
      group2: [],
      group3: [],
    };

    //this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const arr = [];
    const arrSelected = [];
    const one = [];
    const two = [];
    const three = [];

    const ratesNames = this.state.ratesNames;
    const selectedRate = this.state.selectedRate;

    for (let i = 0; i < ratesNames.length; i++) {

      const data = await fetch(serviceLink + `${ratesNames[i]}.json`)
      const body = await data.json();
      //console.log(body)  
      arr.push(body);

      if (ratesNames[i] === selectedRate) { //usd oт map === usd  selected
        ratesNames.map(el => {
          if (el !== ratesNames[i]) {
            //console.log(el)
            //console.log(body[`${element}`][`${el}`])
            const rateNumber = body[`${ratesNames[i]}`][`${el}`]
            const fixedRateNum = this.groupValue(rateNumber)[0]
            const groupRateNum = this.groupValue(rateNumber)[1]

            const obj = {
              'info': `${ratesNames[i].toUpperCase()}/${el.toUpperCase()}`,
              'rateNameSelected': `${ratesNames[i]}`,
              'rateName': `${el}`,
              'rateNumber': fixedRateNum,
              'group': groupRateNum,
            }
            //console.log(obj)
            arrSelected.push(obj)



            if (groupRateNum === '1') {
              one.push(obj)
            } else if (groupRateNum === '2') {
              two.push(obj)
            } else {
              three.push(obj)
            }
          }
        })
      } else { // eur/bgn от map !== usd selected

        //console.log(body[`${element}`][`${selectedRate}`])
        const rateNumber = body[`${ratesNames[i]}`][`${selectedRate}`]
        const fixedRateNum = this.groupValue(rateNumber)[0]
        const groupRateNum = this.groupValue(rateNumber)[1]
        const obj = {
          'info': `${ratesNames[i].toUpperCase()}/${selectedRate.toUpperCase()}`,
          'rateNameSelected': `${ratesNames[i]}`,
          'rateName': `${selectedRate}`,
          'rateNumber': fixedRateNum,
          'group': groupRateNum,
        }
        //console.log(obj)
        arrSelected.push(obj)



        if (groupRateNum === '1') {
          one.push(obj)
        } else if (groupRateNum === '2') {
          two.push(obj)
        } else {
          three.push(obj)
        }
      }

    }

    //console.log(arrSelected.sort((a,b)=> Number(a.group) - Number(b.group)));
    //console.log(arrSelected.filter(a => a.group==='1'));


    this.setState({
      isLoading: false,
      allData: arr,
      selectedRateArr: arrSelected.sort((a, b) => Number(a.group) - Number(b.group)),
    })
  }

  getSelectedRateData(data) {

    const arrSelected = [];
    const one = [];
    const two = [];
    const three = [];


    const ratesNames = this.state.ratesNames;
    const selectedRate = data;
    const allData = this.state.allData;


    for (let index = 0; index < ratesNames.length; index++) {
      const arr = allData.filter(el => el[selectedRate])

      if (ratesNames[index] !== selectedRate) {
        arr.map(el => {
          //console.log(el[selectedRate][`${ratesNames[index]}`])
          const rateNumber = el[selectedRate][`${ratesNames[index]}`]
          const fixedRateNum = this.groupValue(rateNumber)[0]
          const groupRateNum = this.groupValue(rateNumber)[1]
          const obj = {
            'info': `${selectedRate.toUpperCase()}/${ratesNames[index].toUpperCase()}`,
            'rateNameSelected': `${selectedRate}`,
            'rateName': `${ratesNames[index]}`,
            'rateNumber': fixedRateNum,
            'group': groupRateNum,
          }
          if (groupRateNum === '1') {
            one.push(obj)
          } else if (groupRateNum === '2') {
            two.push(obj)
          } else {
            three.push(obj)
          }
          //console.log(obj)
          arrSelected.push(obj)
        })

        const data = allData.find(el => el[ratesNames[index]])
        //console.log(data[`${ratesNames[index]}`][selectedRate])
        const rateNumber = data[`${ratesNames[index]}`][selectedRate]
        const fixedRateNum = this.groupValue(rateNumber)[0]
        const groupRateNum = this.groupValue(rateNumber)[1]
        const obj = {
          'info': `${ratesNames[index].toUpperCase()}/${selectedRate.toUpperCase()}`,
          'rateNameSelected': `${ratesNames[index]}`,
          'rateName': `${selectedRate}`,
          'rateNumber': fixedRateNum,
          'group': groupRateNum,
        }
        if (groupRateNum === '1') {
          one.push(obj)
        } else if (groupRateNum === '2') {
          two.push(obj)
        } else {
          three.push(obj)
        }
        //console.log(obj)
        arrSelected.push(obj)
      }
    }

    return arrSelected;

  }




  roundValue(value) {
    const newValue = Number(value.toFixed(1));
    // console.log(newValue)
    return newValue;

  }

  groupValue(value) {
    const newValue = this.roundValue(value);

    if (newValue < 1) {
      return ([newValue, '1']);
    } else if (newValue >= 1 && newValue < 1.5) {
      return ([newValue, '2']);
    } else if (newValue >= 1.5) {
      return ([newValue, '3']);
    }

  }


  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async handleSubmit(e, data) {
    e.preventDefault();
    const arrSelected = await this.getSelectedRateData(data)

    this.setState({
      selectedRateArr: arrSelected.sort((a, b) => Number(a.group) - Number(b.group)),
    })

  }


  render() {

    return (
      <div className="App" >
        <h2>Rates App</h2>
        <form onSubmit={(e) => this.handleSubmit(e, this.state.selectedRate)} className='form'>
          <div className="form-group">
            <label htmlFor="selectedRate">Choose a rate:</label>
            <select
              value={this.state.selectedRate}
              onChange={(e) => this.handleChange(e)}
              name="selectedRate"
              id="selectedRate"
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="bgn">BGN</option>
              <option value="cad">CAD</option>
              <option value="nzd">NZD</option>
              <option value="aud">AUD</option>
              <option value="chf">CHF</option>
            </select>

          </div>
          <button type="submit" className='btn'>Load New Data</button>

        </form>

        {
          this.state.isLoading ?
            (
              <div className='loading'>Loading...</div>
            )
            :
            (
              <div className='main'>

                <div className='group'>
                  <h3>Group 1: </h3>
                  {
                    this.state.selectedRateArr.filter(a => a.group === '1').map((el, index) =>
                    (
                      <p key={el.group + index}>
                        {el.info} : {el.rateNumber}
                      </p>
                    ))
                  }
                  <p className='count'>Count: {this.state.selectedRateArr.filter(a => a.group === '1').length}</p>
                </div>

                <div className='group'>
                  <h3>Group 2: </h3>
                  {
                    this.state.selectedRateArr.filter(a => a.group === '2').map((el, index) =>
                    (
                      <p key={el.group + index}>
                        {el.info} : {el.rateNumber}
                      </p>
                    ))
                  }
                  <p className='count'>Count: {this.state.selectedRateArr.filter(a => a.group === '2').length}</p>
                </div>



                <div className='group'>
                  <h3>Group 3: </h3>
                  {
                    this.state.selectedRateArr.filter(a => a.group === '3').map((el, index) =>
                    (
                      <p key={el.group + index}>
                        {el.info} : {el.rateNumber}
                      </p>
                    ))
                  }
                  <p className='count'>Count: {this.state.selectedRateArr.filter(a => a.group === '3').length}</p>
                </div>

              </div>
            )
        }
      </div >

    );
  }

}

export default App;

