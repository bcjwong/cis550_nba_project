import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getAllGames, getAllTeams, getAllPlayers} from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;


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

class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      gamesResults:[],
      teamsResults:[],
      playersResults: [],
      
      matchesResults: [],
      matchesPageNumber: 1,
      matchesPageSize: 10,
      
      pagination: null

    }

    //--
    this.seasonOnChange = this.seasonOnChange.bind(this)
    this.goToGame = this.goToGame.bind(this)
    this.goToTeam = this.goToTeam.bind(this)
    this.goToPlayer = this.goToPlayer.bind(this)
  }

  // Click components
  goToGame(gameId) {
    window.location = `/games?id=${gameId}`
  }

  goToTeam(teamId) {
    window.location = `/teams?id=${teamId}`
  }

  goToPlayer(playerName) {
    window.location = `/players?bame=${playerName}`
  }

  // Season change component
  seasonOnChange(value) {
    getAllGames(null,null,value).then(res=>{
      this.setState({ gamesResults: res.results })
    })
  }
  
  // Mounting components
  componentDidMount() {
    getAllTeams(null, null).then(res => {
      this.setState({ teamsResults: res.results })
    })

    getAllGames(null, null, 2021).then(res => {
      this.setState({ gamesResults: res.results })
      
    })

    getAllPlayers(null, null, 2021).then(res => {
      this.setState({ playersResults: res.results })
    })
  }

  render() {

    return (
      <div>
        <MenuBar />
        {/* Teams table */}
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <h3>Players</h3>
          <Table onRow={(record, rowIndex) => {
          }} dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                 
        </div>

        {/* Teams table */}
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <h3>Teams</h3>
          <Table onRow={(record, rowIndex) => {
            return {
              onClick: event => {this.goToTeam(record.TeamId)}, // clicking a row takes the user to a detailed view of the match in the /games page using the MatchId parameter  
            };
          }} dataSource={this.state.teamsResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                  <Column title="Name" dataIndex="name" key="name" sorter= {(a, b) => a.name.localeCompare(b.name)}/>
                  <Column title="Abbreviation" dataIndex="abb" key="abb" sorter= {(a, b) => a.abb.localeCompare(b.abb)}/>
                  <Column title="Year Founded" dataIndex="year" key="year" sorter= {(a, b) => a.year > b.year }/>
                  <Column title="Home Arena" dataIndex="arena" key="arena" sorter= {(a, b) => a.arena > b.arena}/>
              </Table>
        </div>
        
        {/* ---Games table--- */}
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}> 
          <h3>Games</h3>
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
            <Option value="2010">2010</Option>
          </Select>
          
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
                      <Column title="Date" dataIndex="Date" key="Date"/>
            </Table>

        </div>
      </div>
    )
  }

}

export default HomePage

