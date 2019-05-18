import React, { Component } from "react";
import './App.css';
import AppBar from './components/AppBar';
import Footer from './components/Footer';
//material-ui components
import GridList from '@material-ui/core/GridList';
import Paper from '@material-ui/core/Paper';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const API_KEY = "944796b020baf6db54206d5d01bc1ddc";
var pageMin = 1;
var pageMax = 24;
class App extends Component {
  constructor(){
    super()
    this.state = {
      numberOfPages: 0,
      moviesArray: [],
      currentMovie: 0,
      showButton: true,
      modalOpen: false,
    }
  }
  //get number of pages of results
  getNumOfPages(){
      var tmdbURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.asc&include_adult=false&include_video=false&primary_release_year=2019`;
      //get number of page results from tMDB
      fetch(tmdbURL)
        .then(response => response.json())
        .then(data => { 
          this.setState({ 
            numberOfPages: data.total_pages,
          })
      });

  }
  fetchMovieList(start, numOfFetches) {
      if (pageMin >= this.state.numberOfPages){
        this.setState({
          showButton: false,
        });
        pageMax = 0;
        return;
      }
      else if (pageMax > this.state.numberOfPages){
        pageMax = this.state.numberOfPages;
        this.setState({
          showButton: false,
        });
        this.fetchMovieList(pageMin, pageMax);
        return;
      }
      //fetch api
      for (var i = start; i <= numOfFetches; i++){
        var tmdbURL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=release_date.asc&include_adult=false&page=${i}&include_video=false&primary_release_year=2019`;
        /*if (i % 10 === 0){
          this.sleepFor(250);
        }*/
        this.makeFetchRequest(tmdbURL);
      }
      pageMin += 24;
      pageMax += 24;

  }
  sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
  }
  makeFetchRequest(url){
    fetch(url)
    .then(response => response.json())
    .then(json => {
    this.setState({
      moviesArray: this.state.moviesArray.concat(json.results.filter(e => e.popularity >= 10)),
    })
  });
  }
  //get movie details
  fetchMovieDetails(movieID){
    console.log("Fetching movie with ID: "+ movieID);
    var url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}&language=en-US`;
    fetch(url)
        .then(response => response.json())
        .then(data => { 
          this.setState({
            currentMovie: data,
          })
      });
  }
  
  getImageID(tile, imgID){
    if(tile.backdrop_path != null){
      imgID = tile.backdrop_path.split(".", 1);
    }
    else if(tile.poster_path != null && tile.backdrop_path == null){
      imgID = tile.poster_path.split(".", 1);
    }
    else if(tile.backdrop_path == null && tile.poster_path == null){ 
      imgID = "hello";
    }
    return imgID;        
  }
  componentDidMount(){
    console.log("Component Mounted!");
    this.getNumOfPages();
    this.fetchMovieDetails(0);
    //this.fetchMovieList(1, 24);
  }
  //functions to handle the Modal component
  handleOpen = (id) => {
    this.fetchMovieDetails(id);
    this.setState({
      modalOpen: true,
    });
  }
  handleClose = () => {
    this.setState({ modalOpen: false });
  }
  showLoadButton(){
    if (this.state.showButton){
      return(
        <button type="button" className="loadButton" onClick={event => this.fetchMovieList(pageMin, pageMax)}>LOAD MOVIES</button>
      )
    }
  }
  render() {
      var imgID;
      var imgURL;
      var runtime = (this.state.currentMovie.runtime ? this.state.currentMovie.runtime+" mins" : "N/A");
      var genres = (this.state.currentMovie.genres ? this.state.currentMovie.genres : "N/A");
      //genres = Object.values(genres);
      var genreArray = [];
      for (var values in genres) {
        genreArray.push(genres[values].name);
      }
      return (
        
        <div className="App">
          <header>
            <AppBar />
          </header>
          <body className="body">
          <Paper className="paper" elevation={1} justify="center">
            <GridList cellHeight={180} className="gridlist" cols={4} spacing={10}>
                {this.state.moviesArray.map(tile => (
                  <GridListTile key={tile.id} cols={1} className="tiles">
                    {imgID = this.getImageID(tile, imgID)}
                    {imgURL = "https://image.tmdb.org/t/p/original" + imgID + ".svg" }
                    <img src={imgURL} alt={tile.id + "_img"} className="movieIMG"/>
                    <GridListTileBar
                      className="tilebar"
                      title={tile.original_title}
                      actionIcon={
                        <IconButton className="icon" color='secondary' onClick={event => this.handleOpen(tile.id)}>
                          <InfoIcon />
                        </IconButton>
                      }
                    />
                  </GridListTile>

                ))}
            </GridList>
            {this.showLoadButton()}
          </Paper>
          </body>
          <Footer />
            <Dialog
            className="dialogcontainer"
            open={this.state.modalOpen}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle className="dialogtitle">
                {this.state.currentMovie.original_title}<br/>
                <span className="tagline">{this.state.currentMovie.tagline || ""}</span>
              </DialogTitle>
              <DialogContent>
                <DialogContentText className="dialogtext" >
                  {this.state.currentMovie.overview} <br/><br/>
                  Genre: {genreArray.toString()} <br/>
                  Runtime: { runtime }
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
  }
}

export default App;
