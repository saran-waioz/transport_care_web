import React from 'react';
import { Chart, Geom, Axis,  Legend } from 'bizcharts';
import { BOOKING_CHART } from '../../../graphql/Admin/dashboard';
import { client } from "../../../apollo";
import { Select, Card } from 'antd';
import Apicall from "../../../Api/Api";

const { Option } = Select;

class BookingChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      option: 1,
      data: [],
      load:0,
      cols: {
        sold: { alias: 'count' },
        genre: { alias: 'Bookings' }
      },
    }
  }
  componentDidMount = async () => {
    this.fetch_data(this.state.option);
  }

  handleChange = (value) => {
    this.fetch_data(Number(value));
  }

  fetch_data = (option) => {
    this.setState({load:1});
    Apicall({option}, "/user/get_booking_chart").then((res) => {
      var data = [];
      if (res.data.data.get_booking_chart.length > 0) {
        for (let i = 0; i < res.data.data.get_booking_chart.length; i++) {
          let option = { genre: res.data.data.get_booking_chart[i].text, sold: res.data.data.get_booking_chart[i].count };
          data.push(option);
        }
      }
      this.setState({ data,load:0,option })
    });
  }

  render() {
    const { data, cols, load,option } = this.state;
    return (
      <div>
        <Card style={{ boxShadow: 'rgb(154, 176, 167) 0px 1px 6px 0px' }} title="Bookings Chart" bordered={false} className="w-100"
          extra={<Select defaultValue={String(option)} style={{ width: 120 }} loading={load} onChange={this.handleChange}>
            <Option value="1">Current</Option>
            <Option value="2">Week</Option>
            <Option value="3">Month</Option>
            <Option value="4">Year</Option>
          </Select>}>
          <Chart width={600} height={400} data={data} scale={cols}>
            <Axis name="genre" title />
            <Axis name="sold" title />
            <Legend position="top" dy={-20} />
            {/* <Tooltip /> */}
            <Geom type="interval" position="genre*sold" color="#20c997" />
          </Chart>
        </Card>
      </div>
    );
  }
}
export default BookingChart;


