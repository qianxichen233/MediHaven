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
                    <MediHeavenIcon height={'100px'} width={'100px'} />
                    <h1>MEDIHAVEN</h1>
                </div>
                <div className={style.header_text}>
                    <p>
                        Welcome to MEDIHAVEN, your all-in-one electronic medical
                        records (EMR) solution for hospitals. Designed for
                        seamless collaboration between administrators,
                        physicians, and receptionists, MEDIHAVEN streamlines
                        patient management, appointment scheduling, and
                        diagnosis while prioritizing data security and
                        confidentiality. Experience the future of healthcare
                        administration with MEDIHAVEN.
                    </p>
                </div>
                <img src={welcome_img} className={style.cover_img} />
                <div className={style.button_list}>
                    <Button
                        text="NEW USER"
                        width="300px"
                        height="50px"
                        color="white"
                        onClick={() =>
                            navigate('/account', {
                                state: { action: 'register' },
                            })
                        }
                    />
                    <Button
                        text="RETURNING USER"
                        width="300px"
                        height="50px"
                        color="white"
                        onClick={() =>
                            navigate('/account', { state: { action: 'login' } })
                        }
                    />
                </div>
            </div>
            <div className={style.description}>
                <p>
                    MEDIHAVEN is a cutting-edge electronic medical record (EMR)
                    system revolutionizing healthcare administration within
                    hospitals. With MEDIHAVEN, we offer a comprehensive solution
                    tailored to the intricate needs of modern healthcare
                    environments. Our platform seamlessly integrates the core
                    functionalities essential for efficient patient management,
                    physician engagement, and administrative oversight. From
                    initial patient registration to diagnosis and treatment,
                    MEDIHAVEN facilitates a smooth and intuitive workflow for
                    administrators, physicians, and receptionists alike.
                    <br />
                    <br />
                    At the heart of MEDIHAVEN is a robust user role system,
                    empowering administrators, physicians, and receptionists
                    with tailored access and functionalities. Administrators can
                    effortlessly manage user accounts and permissions, ensuring
                    seamless onboarding and streamlined user experiences.
                    Physicians benefit from a dedicated dashboard providing
                    real-time insights into today's schedule, patient histories,
                    and diagnostic tools. Meanwhile, receptionists can
                    efficiently add new patients to the system and schedule
                    appointments with the appropriate physician, optimizing
                    patient flow and resource allocation.
                    <br />
                    <br />
                    In addition to its core functionalities, MEDIHAVEN
                    prioritizes data security and confidentiality. Our platform
                    implements state-of-the-art encryption techniques and data
                    integrity checks to safeguard patient information against
                    unauthorized access and breaches. With built-in chat
                    functionality, users can securely communicate and
                    collaborate within the system, further enhancing
                    coordination and efficiency. Whether you're a hospital
                    administrator seeking to optimize operations or a physician
                    aiming to deliver exceptional patient care, MEDIHAVEN sets
                    the standard for modern EMR systems, empowering healthcare
                    professionals to focus on what matters most: patient
                    well-being.
                </p>
            </div>
        </div>
    );
};

export default Welcome;
