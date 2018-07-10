const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "Twenty-five years and my life is still, Trying to get up that great big hill of hope, For a destination, I realized quickly when I knew I should, That the world was made up of this brotherhood of man, For whatever that means, And so I cry sometimes when I'm lying in bed, Just to get it all out what's in my head, And I, I am feeling a little peculiar, And so I wake in the morning and I step outside, And I take a deep breath and I get real high, and I Scream from the top of my lungs, What's going on?, And I say hey yeah yeah hey yeah yeah, I said hey what's going on?, And I say hey yeah yeah hey yeah yeah,I said hey what's going on?".split(', ')
};

// INITIAL REDUX STATE
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Bye Bye Bye",
      artist: "N'Sync",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      title: "What's Goin' On",
      artist: "Four Non-Blondes",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,
    }
  }
};

// REDUX REDUCERS
// Communicates desired state mutations to store via actions
const lyricChangeReducer = (state = initialState.songsById, action) => {
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;
  switch (action.type) {
    // This is an action that triggers a state mutation
    case 'NEXT_LYRIC':
      // Locates the position of the song whose ID was provided by the action, and increments by 1
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      // Creates a copy of that song's entry in the sonsById state slice, and adds the newArrayPosition value
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })
      // Creates a copy of the enture songsById state slice, and adds the newSongsById state entry to this copy
      newSongsByIdStateSlice = Object.assign({}, state, {
       [action.currentSongId]: newSongsByIdEntry
      });
      // Returns the newSongsByIdStateSlice, which updates state in the Redux store
      return newSongsByIdStateSlice;
    // This is a second state mutating action
    case 'RESTART_SONG':
      // Creates a copy of the song entry in the songsById state slice whose ID matches the currentSongId included with the action, set's arrayPosition to 0
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })
      // Creates a copy of the songsById state slice, adds updated newSongsByIdEntry to this copy
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      // Returns the newSongsByIdStateSlice, which updates state in the Redux store
      return newSongsByIdStateSlice;
      // If action is neither of the above, returns existing state
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricChangeReducer
});

// REDUX STORE
// creates store and passes a reducer as an argument
const { createStore } = Redux;
const store = createStore(rootReducer);

// JEST TESTS + SETUP
const { expect } = window;

expect(lyricChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,
  }
});

expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,
  }
});

expect(songChangeReducer(initialState, { type: null })).toEqual(initialState);

expect(songChangeReducer(initialState, { type: 'CHANGE_SONG', newSelectedSongId: 1 })).toEqual(1);

expect(rootReducer(initialState, { type: null })).toEqual(initialState);
expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));

// RENDERING STATE IN DOM
const renderSongs = () => {
  // Retrieves songsById state slice from store:
  const songsById = store.getState().songsById;
  // Cycles through each key in songsById:
  for (const songKey in songsById) {
    // Locates song corresponding with each key, saves as 'song' constant:
    const song = songsById[songKey]
    // Creates <li>, <h3>, and <em> HTMl elements to render this song's information in the DOM:
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    // Creates text node containing each song's title:
    const songTitle = document.createTextNode(song.title);
    // Creates text node containing each song's artist:
    const songArtist = document.createTextNode(' by ' + song.artist);
    // Adds songTitle text node to the <em> element we created 3 lines up:
    em.appendChild(songTitle);
    // Adds <em> element that now contains song title to <h3> element created 5 lines up:
    h3.appendChild(em);
    // Also adds songArtist text node created 2 lines up to <h3> element  created 6 lines up:
    h3.appendChild(songArtist);
    // Adds click event listener to same  <h3> element, when this <h3> is clicked, an event handler called selectSong() will run, using song's ID as argument:
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    // Adds entire <h3> element to the <li> element created 11 lines above:
    li.appendChild(h3);
    // Appends this <li> element to the <ul> in index.html with a 'songs' ID:
    document.getElementById('songs').appendChild(li);
  }
}

const renderLyrics = () => {
  // Defines a lyricsDisplay constant referring to the div with a 'lyrics' ID in index.html
  const lyricsDisplay = document.getElementById('lyrics');
  // If there are already lyrics in this div, remove them one-by-one until it is empty:
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
  // Locates the song lyric at the current arrayPosition:
  if (store.getState().currentSongId) {
    // Creates DOM text node containing the song lyric identified in line above:
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    // Adds text node created in line above to 'lyrics' div in DOM
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

// Runs renderLyrics() method from above when page is finished loading.
// window.onload is HTML5 version of jQuery's $(document).ready()
window.onload = function() {
  renderSongs();
  renderLyrics();
}

// CLICK LISTENER
const userClick = () => {
  // Runs 'restart_song' action after cycling thru array
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].length - 1) {
    store.dispatch({ type: 'RESTART_SONG', currentSongId: store.getState().currentSongId });
  } else {
    // Otherwise, continues cycling thru array positions
    store.dispatch({ type: 'NEXT_LYRIC', currentSongId: store.getState().currentSongId });
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

// SUBSCRIBE TO REDUX STORE
// This callback is required to receive updated state values from the store, and thus render to the DOM
store.subscribe(renderLyrics);
