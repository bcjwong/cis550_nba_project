import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

// import { getMatchSearch, getMatch } from '../fetcher'
import { getGameSearch, getGame } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;


class MatchesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            awayQuery: "",
            homeQuery: "",
            gamesResults: [],
            selectedGameId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedGameDetails: null

        }

        this.handleAwayQueryChange = this.handleAwayQueryChange.bind(this)
        this.handleHomeQueryChange = this.handleHomeQueryChange.bind(this)
        this.handleSeasonQueryChange = this.handleSeasonQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)

        this.goToGame = this.goToGame.bind(this)

    }


    handleAwayQueryChange(event) {
        this.setState({ awayQuery: event.target.value })
    }

    handleHomeQueryChange(event) {
        this.setState({ homeQuery: event.target.value })
    }
    
    handleSeasonQueryChange(event) {
        this.setState({ seasonQuery: event.target.value })
    }

    goToGame(gameId) {
        window.location = `/games?id=${gameId}`
    }

    updateSearchResults() {
        //TASK 11: call getMatchSearch and update matchesResults in state. See componentDidMount() for a hint
        getGameSearch(this.state.homeQuery, this.state.awayQuery, this.state.seasonQuery).then(res => {
            this.setState({ gamesResults: res.results })
            console.log(res.results)
        })
    }

    componentDidMount() {
        getGameSearch(this.state.homeQuery, this.state.awayQuery, this.state.seasonQuery).then(res => {
            this.setState({ gamesResults: res.results })
        })

        getGame(this.state.selectedGameId).then(res => {
            this.setState({ selectedGameDetails: res.results[0] })
        })




    }

    render() {
        return (
            <div>
                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Home Team</label>
                            <FormInput placeholder="Home Team" value={this.state.homeQuery} onChange={this.handleHomeQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Visitor Team</label>
                            <FormInput placeholder="Away Team" value={this.state.awayQuery} onChange={this.handleAwayQueryChange} />
                        </FormGroup></Col>
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
                {/* TASK 12: Copy over your implementation of the games table from the home page */}
                <Table onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {this.goToGame(record.GameId)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                    };
                    }} dataSource={this.state.gamesResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                            <ColumnGroup title="Teams">
                                <Column title="Home" dataIndex="Home" key="Home" sorter= {(a, b) => a.Home.localeCompare(b.Home)}/>
                                <Column title="Visitor" dataIndex="Visitor" key="Visitor" sorter= {(a, b) => a.Visitor.localeCompare(b.Visitor)}/>
                            </ColumnGroup>
                            <ColumnGroup title="Points">
                                <Column title="HomePts" dataIndex="PTS_home" key="PTS_home" sorter= {(a, b) => a.PTS_home > b.PTS_home }/>
                                <Column title="VisitorPts" dataIndex="PTS_away" key="PTS_away" sorter= {(a, b) => a.PTS_away > b.PTS_away}/>
                            </ColumnGroup>
                            {/* TASK 6: create two columns (independent - not in a column group) for the date and time. Do not add a sorting functionality */}
                            <Column title="Date" dataIndex="Date" key="Date"/>
                    </Table>
                
                <Divider />
                {this.state.selectedGameDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                        <CardBody>


                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Home}</CardTitle>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'center' }}>
                                    {this.state.selectedMatchDetails.Date} at {this.state.selectedMatchDetails.Time}
                                </Col>
                                {/* TASK 13: Add a column with flex = 2, and text alignment = right to display the name of the away team - similar to column 1 in this row */}

                                <Col flex={2} style={{ textAlign: 'right' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Away}</CardTitle>
                                </Col>

                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedMatchDetails.HomeGoals}</h3>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals
                                </Col >
                                {/* TASK 14: Add a column with span = 9, and text alignment = right to display the # of goals the away team scored - similar 1 in this row */}

                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h3>{this.state.selectedMatchDetails.AwayGoals}</h3>
                                </Col>
                            </Row>
                            {/* TASK 15: create a row for goals at half time similar to the row for 'Goals' above, but use h5 in place of h3!  */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.HTHomeGoals}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Half Time Goals
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.HTAwayGoals}</h5>
                                </Col>
                            </Row>

                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <Progress value={this.state.selectedMatchDetails.ShotsOnTargetHome * 100 / this.state.selectedMatchDetails.ShotsHome}>{this.state.selectedMatchDetails.ShotsOnTargetHome} / {this.state.selectedMatchDetails.ShotsHome}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Shot Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    {/* TASK 18: add a progress bar to display the shot accuracy for the away team -  look at the progress bar in column 1 of this row for reference*/}
                                    <Progress value={this.state.selectedMatchDetails.ShotsOnTargetAway * 100 / this.state.selectedMatchDetails.ShotsAway}>{this.state.selectedMatchDetails.ShotsOnTargetAway} / {this.state.selectedMatchDetails.ShotsAway}</Progress>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Corners
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersAway}</h5>
                                </Col>
                            </Row>
                            {/* TASK 16: add a row for fouls cards - check out the above lines for how we did it for corners */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Fouls Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsAway}</h5>
                                </Col>
                            </Row>

                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.RCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Red Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.RCAway}</h5>
                                </Col>
                            </Row>
                            {/* TASK 17: add a row for yellow cards - check out the above lines for how we did it for red cards */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.YCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Yellow Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.YCAway}</h5>
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

export default MatchesPage

