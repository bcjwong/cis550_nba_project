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
        render: (text, row) => <a href={`/players?id=${row.id}`}>{text}</a>
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
    {
        title: 'AVG_PTS',
        dataIndex: 'AVG_PTS',
        key: 'AVG_PTS',
        sorter: (a, b) => a.AVG_PTS - b.AVG_PTS
    },
    {
        title: 'AVG_AST',
        dataIndex: 'AVG_AST',
        key: 'AVG_AST',
        sorter: (a, b) => a.AVG_AST - b.AVG_AST
    },{
        title: 'AVG_REB',
        dataIndex: 'AVG_REB',
        key: 'AVG_REB',
        sorter: (a, b) => a.AVG_REB - b.AVG_REB
    },
];

const getPlayerGameDetails = [
    {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
        sorter: (a, b) => a.Name.localeCompare(b.Name),
        render: (text, row) => <a href={`/players?id=${row.id}`}>{text}</a>
    },
    {
        title: 'Season',
        dataIndex: 'SEASON',
        key: 'SEASON',
        sorter: (a, b) => a.Season - b.Season
    },
    {
        title: 'Date',
        dataIndex: 'Date',
        key: 'Date',
        sorter: (a, b) => a.Date.localeCompare(b.Date)
    },
    {
        title: 'MIN',
        dataIndex: 'MIN',
        key: 'MIN',
        sorter: (a, b) => a.MIN.localeCompare(b.MIN)
    },
    {
        title: 'FG3_PCT',
        dataIndex: 'FG3_PCT',
        key: 'FG3_PCT',
        sorter: (a, b) => a.FG3_PCT - b.FG3_PCT
    },
    {
        title: 'FG_PCT',
        dataIndex: 'FG_PCT',
        key: 'FG_PCT',
        sorter: (a, b) => a.FG_PCT - b.FG_PCT
    },
    {
        title: 'FT_PCT',
        dataIndex: 'FT_PCT',
        key: 'FT_PCT',
        sorter: (a, b) => a.FT_PCT - b.FT_PCT
    },
    {
        title: 'PTS',
        dataIndex: 'PTS',
        key: 'PTS',
        sorter: (a, b) => a.PTS - b.PTS
    },
    {
        title: 'AST',
        dataIndex: 'AST',
        key: 'AST',
        sorter: (a, b) => a.AST - b.AST
    },
    {
        title: 'REB',
        dataIndex: 'REB',
        key: 'REB',
        sorter: (a, b) => a.REB - b.REB
    }
];

class PlayersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nameQuery: '',
            teamQuery: '',
            seasonQuery: '',
            selectedPlayerId: window.location.search ? window.location.search.substring(1).split('=')[1] : 201166,
            selectedPlayerDetails: [],
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
        getPlayer(this.state.selectedPlayerId, null, null).then(res => {
            this.setState({ selectedPlayerDetails: res.results })        
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
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>
                    </Row>


                </Form>
                <Divider />
                <Table dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}/>
                <Divider />

                {this.state.selectedPlayerDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                <Table dataSource={this.state.selectedPlayerDetails} columns={getPlayerGameDetails} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}/>
                </div> : null}



            </div>
        )
    }
}

export default PlayersPage

