import React, { Component } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import Box from '3box';
import resolve from 'did-resolver';
import ProfileHover from 'profile-hover';

import '../styles/index.scss';

class ProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
      ethAddr: '',
      profileName: '',
      blockie: '',
    }
  }

  async componentDidMount() {
    let ethAddr;
    let profilePicture;
    let profileName;

    if (this.props.did) { // profiles via listModerator or listMember
      const doc = await resolve(this.props.did);
      const profile = await Box.getProfile(this.props.did);
      profileName = profile.name;
      profilePicture = profile.image;
      ethAddr = doc.publicKey[2].ethereumAddress;
    } else { // my profile from login
      const { myAddress, myProfilePicture, myName } = this.props;
      profileName = myName;
      profilePicture = myProfilePicture;
      ethAddr = myAddress;
    }

    const blockie = makeBlockie(ethAddr);
    this.setState({ profilePicture, ethAddr, profileName, blockie });
  }

  render() {
    const {
      isTile,
      isUseHovers,
      isModerator,
      isOwner,
    } = this.props;
    const { profilePicture, profileName, blockie, ethAddr } = this.state;
    const image = !!profilePicture ? `https://ipfs.infura.io/ipfs/${profilePicture[0].contentUrl['/']}` : blockie;

    return (
      <React.Fragment>
        {
          isUseHovers ? (
            <ProfileHover noTheme address={ethAddr} orientation="left">
              <ProfileTile
                image={image}
                isTile={isTile}
                profileName={profileName}
                isModerator={isModerator}
                isOwner={isOwner}
              />
            </ProfileHover>
          ) : (
              <ProfileTile
                image={image}
                isTile={isTile}
                profileName={profileName}
                isModerator={isModerator}
                isOwner={isOwner}
              />
            )
        }
      </React.Fragment>
    )
  }
}

export default ProfilePicture;

const ProfileTile = ({ image, isTile, profileName, isModerator, isOwner }) => (
  <div className="profileTile">
    <div className="profileTile_info">
      {image ? (
        <img
          src={image}
          className="profileTile_info_image"
          alt="profile"
        />
      ) : <div className="profileTile_info_image" />}
      {isTile && (
        <p>{profileName}</p>
      )}
    </div>

    {isOwner && <p className="profileTile_creator">Creator</p>}
    {isModerator && <p className="profileTile_moderator">Mod</p>}
  </div>
);
