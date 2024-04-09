import style from './WelcomePage.module.css';
import Button from '../components/UI/Button';
import { MediHeavenIcon } from '../components/UI/Icon';
import Language from '../components/Language';
import welcome_img from '../../../assets/images/welcome.jpg';

import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="bg">
      <div className={style.top_bar}>
        <div>
          <Language />
        </div>
      </div>
      <div className={style.header}>
        <div className={style.title}>
          <MediHeavenIcon />
          <h1>MEDIHAVEN</h1>
        </div>
        <div className={style.header_text}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            non tortor vel tellus condimentum elementum. Sed laoreet erat enim,
            ac sagittis diam scelerisque vitae. Sed blandit pellentesque lectus,
            a efficitur quam convallis vitae. Aenean dapibus venenatis volutpat.
            Ut imperdiet mauris ac lacus euismod, at commodo turpis dictum.
            Etiam fringilla pur
          </p>
        </div>
        <img src={welcome_img} className={style.cover_img} />
        <div className={style.button_list}>
          <Button
            text="NEW USER"
            width="300px"
            height="50px"
            color="white"
            onClick={() => navigate('/register')}
          />
          <Button
            text="RETURNING USER"
            width="300px"
            height="50px"
            color="white"
            onClick={() => navigate('/login')}
          />
        </div>
      </div>
      <div className={style.description}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          non tortor vel tellus condimentum elementum. Sed laoreet erat enim, ac
          sagittis diam scelerisque vitae. Sed blandit pellentesque lectus, a
          efficitur quam convallis vitae. Aenean dapibus venenatis volutpat. Ut
          imperdiet mauris ac lacus euismod, at commodo turpis dictum. Etiam
          fringilla purus accumsan interdum venenatis. Praesent vel sem vitae
          nunc sodales accumsan. Vestibulum neque nulla, lacinia at semper sit
          amet, accumsan at orci. Curabitur sit amet nulla tincidunt,
          condimentum eros vel, tincidunt sapien. Nam finibus leo enim, vitae
          porta orci sodales eget. Donec pretium eu nibh non egestas.
          <br />
          <br />
          Nunc a sollicitudin nibh. Quisque ligula ligula, malesuada eu tempus
          et, tempus eget augue. Duis a interdum arcu. Integer ornare non purus
          finibus posuere. Vivamus sed justo a ex rutrum facilisis a et ipsum.
          Aliquam facilisis aliquam felis in suscipit. Nam eu justo sit amet
          dolor blandit mollis ut a lorem. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Mauris augue enim, tempus at sollicitudin
          eu, pretium in nisi. Phasellus semper dui eget eros euismod, id
          condimentum est consequat. Quisque pharetra consectetur bibendum.
          Morbi vulputate pellentesque ex ac hendrerit. Vivamus odio lectus,
          eleifend tristique nisl in, bibendum vulputate quam.
          <br />
          <br />
          Phasellus consectetur tincidunt maximus. Nunc ex tortor, consectetur
          quis egestas eget, elementum ac lectus. Curabitur condimentum iaculis
          orci vitae faucibus. Nullam luctus ante purus, a luctus est vehicula
          ut. Vivamus in mauris ullamcorper, dictum dui ac, ultricies dui.
          Maecenas dignissim eros eget orci consequat, vitae bibendum nulla
          congue. Nam ut pellentesque sem. Vivamus tristique cursus quam sed
          pharetra. Mauris interdum mattis felis at condimentum. Cras a elit
          eleifend, vulputate risus sit amet, venenatis metus. Aenean vel augue
          blandit, aliquam risus vel, luctus dui. Vivamus venenatis convallis
          enim et scelerisque. Vivamus eget est placerat, fermentum purus eu,
          pretium augue. Fusce et tempus risus. Nulla facilisi. In hac habitasse
          platea dictumst.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
