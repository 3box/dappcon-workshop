# 3Chat: A discussion app built with 3Box threads
This is a demo application created for a workshop at dappcon 2019. If you follow along you will learn how to build a dapp with 3Box threads.



---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the application

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.


## Workshop steps
This app contains logic for a threaded conversation app. The only thing that is missing is implementing the 3Box functionality. Below the steps needed in order to make the app fully functional are described.
During the workshop https://docs.3box.io is your friend!

### Step 1: Basic get profile of current user
Open the file `src/App.jsx` import 3Box and call getProfile in the correct locations.
```js
import Box from '3box'

const myProfile = await Box.getProfile(myAddress);
```

### Step 2: Authenticate user
In the `handleLogin` function we can no add the code needed to authenticate the user to the `3chat` space.
```js
box = await Box.openBox(myAddress, window.ethereum, {})

await new Promise((resolve, reject) => box.onSyncDone(resolve))

const chatSpace = await box.openSpace('3chat');
const myDid = chatSpace.DID;
```

### Step 3: Display posts in topic
When a user clicks on a topic name in the left side of the panel we want to display the posts of that topic. Open the `src/ui/views/Chat.jsx` file and add the following at the appropriate location in the `handleViewTopic` function.
```js
const thread = await chatSpace.joinThread(topic, { firstModerator: owner, members });

thread.onUpdate(() => this.updateThreadPosts());
thread.onNewCapabilities(() => this.updateThreadCapabilities());
```

To actually display the posts we need to edit the `updateThreadPosts` function with a call to `getPosts`.
```js
const posts = await activeTopic.getPosts();
```

### Step 4: Display members and moderators
To display the moderators and members of a topic we need to modify the `updateThreadCapabilities` function by adding the two following calls:
```js
const members = await activeTopic.listMembers();

const moderators = await activeTopic.listModerators();
```
Note that the members call has to be surronded with a try/catch

### Step 5: Get profile of authors, moderators, and members
Repeat Step 1 but in the `src/ui/components/ProfilePicture.jsx` file. Use `this.props.did` instead of `myAddress` in the `getProfile` call.

Next we add profile hovers to the members list, first import the library.
```js
import ProfileHover from 'profile-hover';
```
Now we just wrap the `profileTile` with the following tag:
```js
<ProfileHover noTheme address={ethAddr} orientation="left">
  <!--content-->
</ProfileHover>
```

### Step 6: Add members and mods
To add the ability to add new moderators and members open the `src/ui/views/AppModals.jsx` file.

In the `handleAddThreadMember` function add the following call.
```js
await activeTopic.addMember(threadMember);
```

In the `handleAddThreadMod` function add the following call.
```js
await activeTopic.addModerator(threadMod);
```

### Step 7: Make posts
To add the ability to make posts open the `src/ui/components/Dialogue.jsx` file.

In the `postThread` function add the following call.
```js
await activeTopic.post(postMsg);
```
