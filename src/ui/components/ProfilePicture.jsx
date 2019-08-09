import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import Box from '3box';

import '../styles/index.scss';

class ProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {}
    }
  }

  async componentDidMount() {
    if (this.props.author) {
      console.log('author', this.props.author);
      const profile = await Box.getProfile(this.props.author);
      console.log('profpic', profile);
      this.setState({ profile });
    }
  }

  render() {
    const {
      address,
      profilePicture,
      isModerator
    } = this.props;
    const { profile } = this.state;
    const isProfile = !!Object.keys(profile).length;

    let src;
    if (address) {
      const blockie = makeBlockie(address);
      src = profilePicture && profilePicture.length > 0 && profilePicture[0].contentUrl
        ? `https://ipfs.infura.io/ipfs/${profilePicture[0].contentUrl['/']}`
        : blockie;
    } else if (isProfile) {
      src = `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
    }

    console.log(src);

    if (src) return (
      <img
        src={src}
        className="profilePicture"
        alt="profile"
      />
    );

    return (
      <div className="profilePicture" />
    )
  }
}

export default ProfilePicture;
