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
      arrayPosition: 0
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
const lyricsChangeReducer = (state = initialState.songsById, action) => {
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
  switch (action.type) {
    case 'CHANGE_SONG':
      return action.newSelectedSongId;
    default:
    return state;
  }
}

// JEST TESTS + SETUP
const { expect } = window;

expect(lyricsChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

// expect(lyricsChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
//   1: {
//     title: "Bye Bye Bye",
//     artist: "N'Sync",
//     songId: 1,
//     songArray: songList[1],
//     arrayPosition: 0,
//   },
//   2: {
//     title: "What's Goin' On",
//     artist: "Four Non-Blondes",
//     songId: 2,
//     songArray: songList[2],
//     arrayPosition: 0,
//   }
// });
//
// expect(lyricsChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
//   1: {
//     title: "Bye Bye Bye",
//     artist: "N'Sync",
//     songId: 1,
//     songArray: songList[1],
//     arrayPosition: 0,
//   },
//   2: {
//     title: "What's Goin' On",
//     artist: "Four Non-Blondes",
//     songId: 2,
//     songArray: songList[2],
//     arrayPosition: 0,
//   }
// });

expect(songChangeReducer(initialState.currentSongId, { type: 'CHANGE_SONG', newSelectedSongId: 1})).toEqual(1);

// REDUX STORE
// creates store and passes a reducer as an argument
const { createStore } = Redux;
const store = createStore(lyricsChangeReducer);

// // RENDERING STATE IN DOM
// const renderLyrics = () => {
//   // Defines a lyricsDisplay constant referring to the div with a 'lyrics' ID in index.html
//   const lyricsDisplay = document.getElementById('lyrics');
//   // If there are already lyrics in this div, remove them one-by-one until it is empty:
//   while (lyricsDisplay.firstChild) {
//     lyricsDisplay.removeChild(lyricsDisplay.firstChild);
//   }
//   // Locates the song lyric at the current arrayPosition:
//   const currentLine = store.getState().songLyricsArray[store.getState().arrayPosition];
//   // Creates DOM text node containing the song lyric identified in line above:
//   const renderedLine = document.createTextNode(currentLine);
//   // Adds text node created in line above to 'lyrics' div in DOM
//   document.getElementById('lyrics').appendChild(renderedLine);
// }
// // Runs renderLyrics() method from above when page is finished loading.
// // window.onload is HTML5 version of jQuery's $(document).ready()
// window.onload = function() {
//   renderLyrics();
// }
//
// // CLICK LISTENER
// const userClick = () => {
//   // Runs 'restart_song' action after cycling thru array
//   if (store.getState().arrayPosition === store.getState().songLyricsArray.length - 1) {
//     store.dispatch({ type: 'RESTART_SONG' });
//   } else {
//     // Otherwise, continues cycling thru array positions
//     store.dispatch({ type: 'NEXT_LYRIC' });
//   }
// }
//
// // SUBSCRIBE TO REDUX STORE
// // This callback is required to receive updated state values from the store, and thus render to the DOM
// store.subscribe(renderLyrics);
