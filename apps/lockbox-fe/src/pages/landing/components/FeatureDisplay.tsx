import SharePasswords from '../assets/share.png';
import GeneratePass from '../assets/generate-pass.png';
import SaveVault from '../assets/save-vault.png';

const FeaturesDisplay = () => {
  const workInfoData = [
    {
      image: SaveVault,
      title: 'Save Your Passwords',
      text: 'All your passwords are encrypted and stored in a vault that can only be accessed by you.',
    },
    {
      image: SharePasswords,
      title: 'Share Your Passwords',
      text: 'Share you passwords with other users via end-to-end encryption.',
    },
    {
      image: GeneratePass,
      title: 'Generate Passwords',
      text: 'Generate strong and secure passwords for your accounts.',
    },
  ];
  return (
    <div className='work-section-wrapper'>
      <div className='work-section-top'>
        <p className='primary-subheading'>Features Provided By LockBox</p>
      </div>
      <div className='work-section-bottom'>
        {workInfoData.map((data) => (
          <div className='work-section-info' key={data.title}>
            <div className='info-boxes-img-container'>
              <img src={data.image} alt='' className='feature-image' />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesDisplay;
