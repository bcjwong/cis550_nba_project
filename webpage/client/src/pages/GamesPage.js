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


class GamesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            awayQuery: "",
            homeQuery: "",
            seasonQuery: "",
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
                <Form style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
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
                <Form style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
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
                </Form>
                
                <Divider />
                {this.state.selectedGameDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <CardTitle>{this.state.selectedGameDetails.Home}</CardTitle>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'center' }}>
                                    {this.state.selectedGameDetails.Date}
                                </Col>
                                {/* TASK 13: Add a column with flex = 2, and text alignment = right to display the name of the away team - similar to column 1 in this row */}

                                <Col flex={2} style={{ textAlign: 'right' }}>
                                    <CardTitle>{this.state.selectedGameDetails.Visitor}</CardTitle>
                                </Col>

                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedGameDetails.PTS_home}</h3>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Points
                                </Col >
                                {/* TASK 14: Add a column with span = 9, and text alignment = right to display the # of goals the away team scored - similar 1 in this row */}

                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h3>{this.state.selectedGameDetails.PTS_away}</h3>
                                </Col>
                            </Row>
                            {/* TASK 15: create a row for goals at half time similar to the row for 'Goals' above, but use h5 in place of h3!  */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedGameDetails.AST_home}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Assists 
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedGameDetails.AST_away}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedGameDetails.REB_home}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Rebounds
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedGameDetails.REB_away}</h5>
                                </Col>
                            </Row>

                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <Progress value={this.state.selectedGameDetails.FG_PCT_home * 100}>{this.state.selectedGameDetails.FG_PCT_home}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    FG Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    {/* TASK 18: add a progress bar to display the shot accuracy for the away team -  look at the progress bar in column 1 of this row for reference*/}
                                    {/* <Progress value={this.state.selectedMatchDetails.ShotsOnTargetAway * 100 / this.state.selectedMatchDetails.ShotsAway}>{this.state.selectedMatchDetails.ShotsOnTargetAway} / {this.state.selectedMatchDetails.ShotsAway}</Progress> */}
                                    <Progress value={this.state.selectedGameDetails.FG_PCT_away * 100}>{this.state.selectedGameDetails.FG_PCT_away}</Progress>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <Progress value={this.state.selectedGameDetails.FG3_PCT_home * 100}>{this.state.selectedGameDetails.FG3_PCT_home}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    3 Point FG Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <Progress value={this.state.selectedGameDetails.FG3_PCT_away * 100}>{this.state.selectedGameDetails.FG3_PCT_away}</Progress>
                                </Col>
                            </Row>
                            {/* TASK 16: add a row for fouls cards - check out the above lines for how we did it for corners */}
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <Progress value={this.state.selectedGameDetails.FT_PCT_home * 100}>{this.state.selectedGameDetails.FT_PCT_home}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Free Throw Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <Progress value={this.state.selectedGameDetails.FT_PCT_away * 100}>{this.state.selectedGameDetails.FT_PCT_away}</Progress>
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

export default GamesPage

