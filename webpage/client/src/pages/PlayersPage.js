import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import MenuBar from '../components/MenuBar';
import { getPlayerSearch, getPlayer } from '../fetcher'
import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';
const { Column, ColumnGroup } = Table;




const wideFormat = format('.3r');

const playerColumns = [
    {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
        sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
        title: 'Team',
        dataIndex: 'Team',
        key: 'Team',
        sorter: (a, b) => a.Team.localeCompare(b.Team)
    },
    {
        title: 'Season',
        dataIndex: 'Season',
        key: 'Season',
        sorter: (a, b) => a.Season - b.Season

    },
    // TASK 19: copy over your answers for tasks 7 - 9 to add columns for potential, club, and value
    // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
];


class PlayersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nameQuery: '',
            teamQuery: '',
            seasonQuery: '',
            ptsQuery: '',
            atsQuery: '',
            rbsQuery: '',
            selectedPlayerId: window.location.search ? window.location.search.substring(1).split('=')[1] : 229594,
            selectedPlayerDetails: null,
            playersResults: []

        }

        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
        this.handleSeasonQueryChange = this.handleSeasonQueryChange.bind(this)
        this.handleTeamQueryChange = this.handleTeamQueryChange.bind(this)

        this.goToPlayer = this.goToPlayer.bind(this)
    }

    

    handleNameQueryChange(event) {
        this.setState({ nameQuery: event.target.value })
    }

    handleSeasonQueryChange(event) {
        // TASK 20: update state variables appropriately. See handleNameQueryChange(event) for reference
        this.setState({ seasonQuery: event.target.value })
    }

    handleTeamQueryChange(event) {
        // TASK 21: update state variables appropriately. See handleNameQueryChange(event) for reference
        this.setState({ teamQuery: event.target.value })
    }

    goToPlayer(playerName) {
        window.location = `/players?bame=${playerName}`
    }

    updateSearchResults() {
        //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
        getPlayerSearch(this.state.nameQuery, this.state.teamQuery, this.state.seasonQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })
    }

    componentDidMount() {
        getPlayerSearch(this.state.nameQuery, this.state.teamQuery, this.state.seasonQuery, null, null).then(res => {
            this.setState({ playersResults: res.results })
        })

        // TASK 25: call getPlayer with the appropriate parameter and set update the correct state variable. 
        // See the usage of getMatch in the componentDidMount method of MatchesPage for a hint! 
        getPlayer(this.state.selectedPlayerName).then(res => {
            this.setState({ selectedPlayerDetails: res.results[0] })
        })
    }

    render() {
        return (

            <div>

                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Name</label>
                            <FormInput placeholder="Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Team Name</label>
                            <FormInput placeholder="Team" value={this.state.teamQuery} onChange={this.handleTeamQueryChange} />
                        </FormGroup></Col>
                        {/* TASK 26: Create a column for Club, using the elements and style we followed in the above two columns. Use the onChange method (handleClubQueryChange)  */}
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Season</label>
                            <FormInput placeholder="Season" value={this.state.seasonQuery} onChange={this.handleSeasonQueryChange} />
                        </FormGroup></Col>

                    </Row>


                </Form>
                <Divider />
                <Table onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {this.goToPlayer(record.PlayerName)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                    };
                    }} dataSource={this.state.playersResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
    
                            <Column title="Name" dataIndex="Name" key="Name" sorter= {(a, b) => a.Name.localeCompare(b.Name)}/>
                            <Column title="Team" dataIndex="Team" key="Team" sorter= {(a, b) => a.Team.localeCompare(b.Team)}/>
                            <Column title="pts" dataIndex="pts" key="pts" sorter= {(a, b) => a.pts > b.pts }/>
                            <Column title="pts" dataIndex="ats" key="ats" sorter= {(a, b) => a.ats > b.ats }/>
                            <Column title="rbs" dataIndex="rbs" key="rbs" sorter= {(a, b) => a.rbs > b.rbs }/>
                </Table>
                <Divider />

                {this.state.selectedPlayerDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                </div> : null}

            </div>
        )
    }
}

export default PlayersPage

