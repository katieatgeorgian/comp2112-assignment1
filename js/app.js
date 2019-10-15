/* Variables */
const AVATAR_URL = "https://avatars0.githubusercontent.com/u/47111708?v=4";
const main = document.querySelector("main");
const tweetBtn = document.querySelector("form");
const myAvatar = [...document.querySelectorAll(".my_avatar")];
myAvatar.forEach(img => {
  img.src = AVATAR_URL;
});
const imgGifPoll = document.querySelector("#imgGifPoll");
const searchGifBtn = document.querySelector("#searchGifBtn");
const searchGif = document.querySelector("#searchGif");
const toggle = document.querySelector("input.custom-control-input");

const emojibtn = document.querySelector("#emojibtn");
const emojimodalbody = document.querySelector("#emojimodalbody");
const textarea = document.querySelector("#textarea");
const searchEmoji = document.querySelector("#searchEmoji");
const emojiCategories = document.querySelector("#emojiCategories");
const pollButton = document.querySelector("#pollButton");

// this will be our text and any images, gifs and polls the user posts
const tweets = JSON.parse(localStorage.getItem("twitter")) || [];

//holds all the mapped originalGifs info
let gifs = [];

// these gifs are the original JSON we got from our fetch in case we need it
let originalGifs = [];

//holds all the mapped originalGifs in original size
let gifsArrayOriginalSize = [];

//holds the mapped originalGifs in their stilled format
let gifsStill = [];

//hold the emojis
let emojis = [];
let emojiIcons = [];

/* Functions */
// this will display all the objects in my tweets array
// where each object contains avatar url, username, name and text
function render() {
  rememberTweets();

  main.innerHTML = tweets
    .map(
      (tweet, idx) => `
        <aside>
         <div>
            <img class="avatar" src="${tweet.avatar}">
         </div>
         <div class="formatted-tweet">
            <h6><a href="https://twitter.com/${tweet.username}">${
        tweet.name
      }</a> <span class="username">@${tweet.username}</span></h6>
            <p>${tweet.tweet}</p>
            <div class="imgGifPoll">
            ${tweet.img} 
            </div>
            <div class="pollSpace">
            ${tweet.isPollCreated ? displayVotes(tweet, idx) : ""}
            </div>
            <div>
                <section>
                    <div id="reactions" class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-message-outline"
                            aria-label="reply"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-twitter-retweet"
                            aria-label="retweet"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-heart-outline"
                            aria-label="like"
                            style=""
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-upload"
                            aria-label="share"
                        ></button>
                    </div>
                </section>
            </div>
        </div>
        </aside>
          `
    )
    .join("");
}

function rememberTweets() {
  //store our current tweets array in localstorage but remove memory of it first
  localStorage.removeItem("twitter");

  //remember tweets array
  localStorage.setItem("twitter", JSON.stringify(tweets));
}

function tweeting(e) {
  e.preventDefault();
  const p = document.querySelector("textarea");
  const voteOptions = {
    a: pollSpace.querySelector("#pollchoice1")
      ? pollSpace.querySelector("#pollchoice1").value
      : "",
    b: pollSpace.querySelector("#pollchoice2")
      ? pollSpace.querySelector("#pollchoice2").value
      : "",
    c: pollSpace.querySelector("#pollchoice3")
      ? pollSpace.querySelector("#pollchoice3").value
      : "",
    d: pollSpace.querySelector("#pollchoice4")
      ? pollSpace.querySelector("#pollchoice4").value
      : ""
  };

  if (textarea.value) {
    // store tweet text in tweets object
    tweets.unshift({
      avatar: AVATAR_URL,
      name: "Katie",
      username: "katieatgeorgian",
      tweet: p.value,
      img: imgGifPoll.innerHTML,
      isPollCreated: !!(
        voteOptions.a &&
        voteOptions.b &&
        voteOptions.c &&
        voteOptions.d
      ),
      voteOptions, //in ES6 if both key and value have same name just as is
      pollResults: {},
      isPollDone: false
    });
  }

  // clear textbox and any image
  p.value = "";
  imgGifPoll.innerHTML = "";
  pollSpace.innerHTML = "";

  render();
}

/* select photo function */
// if user selects the image icon in order to insert an image from their comptuer
function handleFileSelect(evt) {
  const reader = new FileReader();

  reader.addEventListener("load", e => {
    imgGifPoll.innerHTML = `<img class="thumb" src="${e.target.result}" style="width: 100%"/>`;
  });

  // Read in the image file as a data URL.
  reader.readAsDataURL(evt.target.files[0]);
}

/* GIF functions */
function fetchGifs() {
  const API_KEY = "URSRgSXuGgvVg6LKFDlUsp0bWM80ansC";
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchGif.value}`
  )
    .then(res => res.json())
    .then(data => {
      originalGifs = data.data;
      console.log(originalGifs);
      gifs = originalGifs
        .map(
          (gif, index) =>
            `<img data-index=${index} class="p-1" src=${gif.images.fixed_height_small.url}>`
        )
        .join("");

      gifsArrayOriginalSize = originalGifs.map(
        (gif, index) =>
          `<video width="320" height="240" controls>
          <source src="${gif.images.original_mp4.mp4}" type="video/mp4">
        </video>`
      );

      gifsStill = originalGifs
        .map(
          (gif, index) =>
            `<img data-index=${index} class="p-1" src=${gif.images.fixed_height_small_still.url}>`
        )
        .join("");

      if (toggle.checked == true) {
        browsegifs.innerHTML = gifs;
      } else {
        browsegifs.innerHTML = gifsStill;
      }

      // unhide switch to toggle gif animations
      switchgifsarea.classList.remove("hide");
    });
}

//function to select one image from search results
function chooseGif(e) {
  e.preventDefault();
  if (e.target.matches("img")) {
    const index = e.target.dataset.index;

    let oneImage = `${gifsArrayOriginalSize[index]}`;
    imgGifPoll.innerHTML = oneImage;
    //closes modal
    $("#insertgif").modal("hide");
  } else {
    return;
  }
}

//function to switch between still photo and gif photos
function toggleGifs() {
  if (toggle.checked == true) {
    browsegifs.innerHTML = gifs;
  } else {
    browsegifs.innerHTML = gifsStill;
  }
}

/* emoji functions */
async function browseEmojis(e) {
  e.preventDefault();

  const response = await fetch(
    `https://unpkg.com/emoji.json@12.1.0/emoji.json`
  );
  const data = await response.json();

  emojis = data;

  emojiIcons = emojis
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" data-category="${emoji.category}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = emojiIcons;
}

//function to select one image from search results
function chooseEmoji(e) {
  e.preventDefault();

  if (e.target.dataset.index) {
    const index = e.target.dataset.index;

    let selectedEmoji = e.target.innerHTML;
    textarea.value += selectedEmoji;
    //closes modal
    // $("#emojimodal").modal("hide");
  }
}

function searchEmojis(e) {
  e.preventDefault();
  const search = searchEmoji.value;
  //the else if and else were done because the instructions said to use the same techniques as the in-class exercise 4b which
  //requires nothing to be displayed if less than 3 characters; however, that didn't make sense to me so I compromised with this
  if (search.length >= 2) {
    let filteredEmojis = emojis
      .filter(emoji => emoji.name.includes(`${search}`))
      .map(
        (emoji, index) =>
          `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
      )
      .join("");
    emojimodalbody.innerHTML = filteredEmojis;
  } else if (search.length == 0) {
    emojimodalbody.innerHTML = emojiIcons;
  } else {
    emojimodalbody.innerHTML = "";
  }
}

/*** FILTER BASED ON SMILEY FACE ICON ***/
function searchSmiles(e) {
  e.preventDefault();

  const smiles = emojis
    .filter(emoji => emoji.category.includes("Smileys"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = smiles;
  emojimodalbody.scrollTop = 0;
}

const smileys = emojiCategories.querySelector("img:first-child");
smileys.addEventListener("click", searchSmiles);

/*** FILTER BASED ON ANIMALS ***/
function searchAnimals(e) {
  e.preventDefault();

  const animalsArray = emojis
    .filter(emoji => emoji.category.includes("Animal"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = animalsArray;
  emojimodalbody.scrollTop = 0;
}

const animals = emojiCategories.querySelector("img:nth-of-type(2)");
animals.addEventListener("click", searchAnimals);

/*** FILTER BASED ON FOOD ***/
function searchFoods(e) {
  e.preventDefault();

  const foodsArray = emojis
    .filter(emoji => emoji.category.includes("Food"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = foodsArray;
  emojimodalbody.scrollTop = 0;
}

const food = emojiCategories.querySelector("img:nth-of-type(3)");
food.addEventListener("click", searchFoods);

/*** FILTER BASED ON SPORTS ***/
function searchSports(e) {
  e.preventDefault();

  const sportsArray = emojis
    .filter(emoji => emoji.category.includes("sport"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = sportsArray;
  emojimodalbody.scrollTop = 0;
}

const sport = emojiCategories.querySelector("img:nth-of-type(4)");
sport.addEventListener("click", searchSports);

/*** FILTER BASED ON TRAVELS ***/
function searchTravels(e) {
  e.preventDefault();

  const travelsArray = emojis
    .filter(emoji => emoji.category.includes("Travel"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = travelsArray;
  emojimodalbody.scrollTop = 0;
}

const travel = emojiCategories.querySelector("img:nth-of-type(5)");
travel.addEventListener("click", searchTravels);

/*** FILTER BASED ON OBJECTS ***/
function searchObjects(e) {
  e.preventDefault();

  const objectsArray = emojis
    .filter(emoji => emoji.category.includes("Object"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = objectsArray;
  emojimodalbody.scrollTop = 0;
}

const object = emojiCategories.querySelector("img:nth-of-type(6)");
object.addEventListener("click", searchObjects);

/*** FILTER BASED ON SYMBOLS ***/
function searchSymbols(e) {
  e.preventDefault();

  const symbolsArray = emojis
    .filter(emoji => emoji.category.includes("symbol"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = symbolsArray;
  emojimodalbody.scrollTop = 0;
}

const symbol = emojiCategories.querySelector("img:nth-of-type(7)");
symbol.addEventListener("click", searchSymbols);

/*** FILTER BASED ON FLAGS ***/
function searchFlags(e) {
  e.preventDefault();

  const flagsArray = emojis
    .filter(emoji => emoji.category.includes("Flag"))
    .map(
      (emoji, index) =>
        `<div data-index=${index} data-name="${emoji.name}" class="emoji">${emoji.char}</div>`
    )
    .join("");
  emojimodalbody.innerHTML = flagsArray;
  emojimodalbody.scrollTop = 0;
}

const flag = emojiCategories.querySelector("img:last-child");
flag.addEventListener("click", searchFlags);

/** POLL CODE **/

function insertPoll() {
  // todo: disable the tweet button until all fields plus a question is inserted
  textarea.placeholder = "Ask a question...";

  pollSpace.innerHTML = `
                  <form>
                    <div class="form-group">
                      <input type="text" class="form-control" id="pollchoice1" aria-describedby="" maxlength="25" placeholder="Choice 1">
                      <br>
                      <input type="text" class="form-control" id="pollchoice2" aria-describedby="" maxlength="25" placeholder="Choice 2">
                      <br>
                      <input type="text" class="form-control" id="pollchoice3" aria-describedby="" maxlength="25" placeholder="Choice 3">
                      <br>
                      <input type="text" class="form-control" id="pollchoice4" aria-describedby="" maxlength="25" placeholder="Choice 4">
                      <br><br>
                      <h6>Poll length</h6>
                      <hr style="margin:0">
                      <div class="row">
                        <div class="col">
                          <label for="polldays">Days</label>
                          <select class="form-control" id="polldays">
                            <option>0</option>
                            <option selected>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                        <div class="col">
                          <label for="pollhours">Hours</label>
                          <select class="form-control" id="pollhours">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                        <div class="col">
                          <label for="pollminutes">Minutes</label>
                          <select class="form-control" id="pollminutes">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>                        
                      </div>
                    </div>
                  </form>
    `;
}

function displayVotes(tweet, idx) {
  const percents = votesToPercentages(tweets[idx].pollResults);
  const letterChosen = tweets[idx].pollResults.youChose;

  if (tweet.isPollDone) {
    return `
    <div class="bargraph">
    <div id="bar1" class="bar" style="flex-basis: ${
      percents.a
    }%" data-vote="a">${tweets[idx].voteOptions.a} ${
      letterChosen == "a" ? "&check;" : ""
    }</div>
    <div id="percentage1">${percents.a}%</div>
  </div>
  <div class="bargraph">
    <div id="bar2" class="bar" style="flex-basis: ${
      percents.b
    }%" data-vote="b">${tweets[idx].voteOptions.b} ${
      letterChosen == "b" ? "&check;" : ""
    }</div>
    <div id="percentage2">${percents.b}%</div>
  </div>
  <div class="bargraph">
    <div id="bar3" class="bar" style="flex-basis: ${
      percents.c
    }%" data-vote="c">${tweets[idx].voteOptions.c} ${
      letterChosen == "c" ? "&check;" : ""
    }</div>
  <div id="percentage3">${percents.c}%</div>
  </div>
  <div class="bargraph">
    <div id="bar4" class="bar" style="flex-basis: ${
      percents.d
    }%" data-vote="d">${tweets[idx].voteOptions.d} ${
      letterChosen == "d" ? "&check;" : ""
    }</div>
  <div id="percentage4">${percents.d}%</div>
  </div>
  <div id="totalVotes">${percents.total} votes</div>    
    `;
  }
  return `
  <div class="poll flex-col" data-idx="${idx}">
  <button class="vote" value="a">${tweet.voteOptions.a}</button>
  <button class="vote" value="b">${tweet.voteOptions.b}</button>
  <button class="vote" value="c">${tweet.voteOptions.c}</button>
  <button class="vote" value="d">${tweet.voteOptions.d}</button>
  </div>
  `;
}

async function vote(e) {
  if (!e.target.matches(".vote")) {
    return;
  }
  const index = e.target.closest(".poll").dataset.idx;

  const res = await fetch(
    "https://my.api.mockaroo.com/votes.json?key=bec6cc40"
  );
  const data = await res.json();
  const keyValues = Object.entries(data); //transform object into array
  const newKeyValues = keyValues.map(keyValArr => [
    keyValArr[0],
    parseInt(keyValArr[1])
  ]);

  //push JSON results into our tweets array
  tweets[index].pollResults = Object.fromEntries(newKeyValues); //takes array and turn back into Obj
  tweets[index].pollResults.youChose = e.target.value;
  tweets[index].isPollDone = true;

  render();
}

function votesToPercentages(votes) {
  const total = votes.a + votes.b + votes.c + votes.d;

  return {
    a: Math.floor((votes.a / total) * 100),
    b: Math.floor((votes.b / total) * 100),
    c: Math.floor((votes.c / total) * 100),
    d: Math.floor((votes.d / total) * 100),
    total
  };
}

// EVENT LISTENERS
emojibtn.addEventListener("click", browseEmojis);
emojimodalbody.addEventListener("click", chooseEmoji);
searchEmoji.addEventListener("keyup", searchEmojis);
pollButton.addEventListener("click", insertPoll);
document
  .querySelector("#uploadPic")
  .addEventListener("change", handleFileSelect, false);
tweetBtn.addEventListener("submit", tweeting);
searchGifBtn.addEventListener("click", fetchGifs);
browsegifs.addEventListener("click", chooseGif);
toggle.addEventListener("click", toggleGifs);
main.addEventListener("click", vote);

render();
