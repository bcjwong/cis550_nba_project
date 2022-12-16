import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,
    Select

} from 'antd'

import { getTeamPlayers, getConferenceTeams, getTopTeams } from '../fetcher'


import MenuBar from '../components/MenuBar';
import { getConfirmLocale } from 'antd/lib/modal/locale';

const { Column, ColumnGroup } = Table;
const { Option } = Select;


class TeamsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            conferenceQuery: "",
            seasonQuery: 2021,
            gamesResults:[],
            teamsConferenceResults:[],
            topTeamsResults:[],

            selectedTeamId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            teamPlayersResults:null,
            
            // matchesPageNumber: 1,
            // matchesPageSize: 10,
            // pagination: null
      
          }

        this.conferenceOnChange = this.conferenceOnChange.bind(this)
        // this.goToPlayer = this.goToPlayer.bind(this)
        this.goToTeam = this.goToTeam.bind(this)
        this.seasonOnChange = this.seasonOnChange.bind(this)

    }

    // Click components
    goToTeam(teamId) {
        window.location = `/teams?id=${teamId}`
    }

    // Conference change component
    conferenceOnChange(value) {
        getConferenceTeams(value).then(res=>{
        this.setState({ teamsConferenceResults: res.results })
        })
    }

    // season on change for top 5 teams
    seasonOnChange(value) {
        getTopTeams(value).then(res=>{
        this.setState({ topTeamsResults: res.results })
        })
    }

    // Mounting components
    componentDidMount() {
        getConferenceTeams(this.state.conferenceQuery).then(res => {
        this.setState({ teamsConferenceResults: res.results })
        })

        getTeamPlayers(this.state.selectedTeamId).then(res => {
        this.setState({ teamPlayersResults: res.results[0] })
        })

        getTopTeams(this.state.seasonQuery).then(res=>{
            this.setState({ topTeamsResults: res.results })
            })


    }


    render() {
        return (
            <div>
                <MenuBar />
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}> 
                <h3>Team Rankings</h3>
                <Select defaultValue="2021" style={{ width: 120 }} onChange={this.seasonOnChange}>
                    <Option value="2021">2021</Option>
                    <Option value="2020">2020</Option>
                    <Option value="2019">2019</Option>
                    <Option value="2018">2018</Option>
                    <Option value="2017">2017</Option>
                    <Option value="2016">2016</Option>
                    <Option value="2015">2015</Option>
                    <Option value="2014">2014</Option>
                    <Option value="2013">2013</Option>
                    <Option value="2012">2012</Option>
                    <Option value="2011">2011</Option>
                </Select>

                <Table onRow={(record, rowIndex) => {
                    }} dataSource={this.state.topTeamsResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                            {/* <ColumnGroup title="Teams"> */}
                            <Column title="Rank" dataIndex="rk" key="rk" sorter= {(a, b) => a.rk > b.rk }/>
                            <Column title="Team" dataIndex="team" key="team" sorter= {(a, b) => a.team > b.team }/>
                            <Column title="Games" dataIndex="G" key="G" sorter= {(a, b) => a.G > b.G }/>
                            <Column title="Wins" dataIndex="W" key="W" sorter= {(a, b) => a.W > b.W }/>
                            <Column title="Losses" dataIndex="L" key="L" sorter= {(a, b) => a.L > b.L }/>
                            
                            {/* </ColumnGroup> */}
                    </Table>


                </div>

                {/* ---Teams table--- */}
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}> 
                <h3>Teams 2021 stats</h3>
                <Select defaultValue="Conference" style={{ width: 120 }} onChange={this.conferenceOnChange}>
                    <Option value="EAST">East</Option>
                    <Option value="WEST">West</Option>
                    <Option value="">All</Option>
                </Select>
                
                <Table onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {this.goToTeam(record.TeamId)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                    };
                    }} dataSource={this.state.teamsConferenceResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                            {/* <ColumnGroup title="Teams"> */}
                                <Column title="Team Name (click for details)" dataIndex="nickname" key="nickname" sorter= {(a, b) => a.nickname.localeCompare(b.nickname)}/>
                                <Column title="Average Pts as Home" dataIndex="avg_pts_home" key="avg_pts_home" sorter= {(a, b) => a.avg_pts_home > b.avg_pts_home }/>
                                <Column title="Average Pts as Visitor" dataIndex="avg_pts_away" key="avg_pts_away" sorter= {(a, b) => a.avg_pts_away > b.avg_pts_away}/>
                            {/* </ColumnGroup> */}
                    </Table>

                </div>
                <Divider />
                
                        
                {this.state.teamPlayersResults ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                    
                        <CardBody>
                        <Row gutter='30' align='middle' justify='center'>
                            <Col flex={2} style={{ textAlign: 'left' }}>
                                <img src={this.state.teamPlayersResults.logo} referrerpolicy="no-referrer" alt={null} style={{height:'15vh'}}/>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'center' }}>
                                <h3>{this.state.teamPlayersResults.name}</h3>
                            </Col>
                            <Col flex={2} style={{ textAlign: 'right' }}>
                                <img src={this.state.teamPlayersResults.conf_logo} referrerpolicy="no-referrer" alt={null} style={{height:'15vh'}}/>
                            </Col>
                        </Row>

                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={10} style={{ textAlign: 'center' }}>
                                    <h5>Current Season Players (2021)</h5>
                                </Col >
                        </Row>
                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h6>{this.state.teamPlayersResults.cp1}</h6>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <h6>{this.state.teamPlayersResults.cp2}</h6>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h6>{this.state.teamPlayersResults.cp3}</h6>
                                </Col>
                        </Row>
                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h6>{this.state.teamPlayersResults.cp4}</h6>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <h6>{this.state.teamPlayersResults.cp5}</h6>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h6>{this.state.teamPlayersResults.cp6}</h6>
                                </Col>
                        </Row>
                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h6>{this.state.teamPlayersResults.cp7}</h6>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <h6>{this.state.teamPlayersResults.cp8}</h6>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h6>{this.state.teamPlayersResults.cp9}</h6>
                                </Col>
                        </Row>
                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h6>{this.state.teamPlayersResults.cp10}</h6>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <h6>{this.state.teamPlayersResults.cp11}</h6>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h6>{this.state.teamPlayersResults.cp12}</h6>
                                </Col>
                        </Row>
                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h6>{this.state.teamPlayersResults.cp13}</h6>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <h6>{this.state.teamPlayersResults.cp14}</h6>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h6>{this.state.teamPlayersResults.cp15}</h6>
                                </Col>
                        </Row>
                        <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h6>{this.state.teamPlayersResults.cp16}</h6>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    <h6>{this.state.teamPlayersResults.cp17}</h6>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h6>{this.state.teamPlayersResults.cp18}</h6>
                                </Col>
                        </Row>






                        </CardBody>

                    </Card>
                
                </div> : null}
                <Divider />
                

            </div>
        )
    }
}

export default TeamsPage
