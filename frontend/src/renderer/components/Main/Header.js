import styles from './Header.module.scss';
import Tab from './Tab';

const Header = (props) => {
    return (
        <>
            <header className={styles.header}>
                <div className={styles.top}>
                    <div className={styles.menu}>
                        <span>Finder</span>
                        <span>Flow</span>
                        <span>Recall</span>
                        <span>Message</span>
                        <span>Patient</span>
                        <span>Fees</span>
                        <span>Procedures</span>
                        <span>Reports</span>
                        <span>Misc.</span>
                        <span>Popups</span>
                    </div>
                    <div className={styles.search}>
                        <span>Search for patient</span>
                    </div>
                </div>
                <Tab
                    page={props.page}
                    onChange={props.onPageChange}
                    pagelist={props.pagelist}
                />
            </header>
            <div className={styles.placeholder}></div>
        </>
    );
};

export default Header;
