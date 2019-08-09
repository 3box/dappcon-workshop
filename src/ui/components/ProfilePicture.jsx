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
    const {
      author,
    } = this.props;
    const profile = await Box.getProfile(author);
    this.setState({ profile });
  }

  render() {
    const {
      address,
      profilePicture,
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
