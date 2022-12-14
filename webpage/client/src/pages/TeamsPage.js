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

import { getTeamPlayers, getConferenceTeams } from '../fetcher'


import MenuBar from '../components/MenuBar';
import { getConfirmLocale } from 'antd/lib/modal/locale';

const { Column, ColumnGroup } = Table;
const { Option } = Select;


class TeamsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            conferenceQuery: "",
            gamesResults:[],
            teamsConferenceResults:[],

            selectedTeamId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            teamPlayersResults:null,
            
            matchesPageNumber: 1,
            matchesPageSize: 10,
            pagination: null
      
          }

        this.conferenceOnChange = this.conferenceOnChange.bind(this)
        // this.goToPlayer = this.goToPlayer.bind(this)
        this.goToTeam = this.goToTeam.bind(this)

    }

    // Click components
    goToTeam(teamId) {
        window.location = `/teams?id=${teamId}`
    }

    // goToPlayer(playerId) {
    //     window.location = `/players?id=${teamId}`
    // }

    // Conference change component
    conferenceOnChange(value) {
        getConferenceTeams(value).then(res=>{
        this.setState({ teamsConferenceResults: res.results })
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
    }


    render() {
        return (
            <div>
                <MenuBar />

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
                                <Column title="Avg Pts as Home" dataIndex="avg_pts_home" key="avg_pts_home" sorter= {(a, b) => a.avg_pts_home.localeCompare(b.avg_pts_home)}/>
                                <Column title="Avg Pts as Away" dataIndex="avg_pts_away" key="avg_pts_away" sorter= {(a, b) => a.avg_pts_away.localeCompare(b.avg_pts_away)}/>
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

