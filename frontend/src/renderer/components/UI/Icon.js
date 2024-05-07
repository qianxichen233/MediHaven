import styles from './Icon.module.scss';

import icon from '../../../../assets/Medihaven_Icon.png';

const MediHeavenIcon = ({ height, width }) => {
    return (
        <div
            className={styles.icon}
            styles={{
                height: height,
                width: width,
            }}
        >
            <img src={icon} />
        </div>
    );

    // return <div className={styles.icon}></div>;
};

const OptionIcon = ({ height, width }) => {
    return (
        <svg
            fill="#000000"
            height={height}
            width={width}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32.055 32.055"
            xml:space="preserve"
        >
            <g>
                <path
                    d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967
       C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967
       s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967
       c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"
                />
            </g>
        </svg>
    );
};

const PhysicianIcon = ({ height, width }) => {
    return (
        <svg
            fill="#000000"
            version="1.1"
            id="Doctor"
            xmlns="http://www.w3.org/2000/svg"
            width={height}
            height={width}
            viewBox="0 0 300 300"
            enable-background="new 0 0 300 300"
            xml:space="preserve"
        >
            <path
                d="M206.243,38.157c0-15.695-12.769-28.463-28.463-28.463c-10.484,0-19.656,5.702-24.595,14.164
   c-0.984-0.076-1.974-0.128-2.977-0.128c-13.41,0-25.21,6.86-32.1,17.27h31.352c0.355,3.568,1.378,6.94,2.932,10h-38.984
   c-1.07,3.53-1.65,7.29-1.65,11.17c0,21.24,17.22,38.45,38.45,38.45c20.451,0,37.165-15.972,38.364-36.131
   C198.929,60.228,206.243,50.033,206.243,38.157z M177.78,56.62c-10.181,0-18.463-8.282-18.463-18.463s8.282-18.463,18.463-18.463
   s18.463,8.283,18.463,18.463S187.96,56.62,177.78,56.62z M177.863,31.017c3.943,0,7.14,3.197,7.14,7.14s-3.197,7.14-7.14,7.14
   s-7.14-3.197-7.14-7.14S173.919,31.017,177.863,31.017z M196.333,112h-21.175L157,151.405V112h-14v39.482L124.845,112h-21.179
   C76.28,112,54,134.281,54,161.667V269.5c0,12.406,10.093,22.5,22.5,22.5c6.512,0,12.388-2.781,16.5-7.218V292h114v-7.218
   c4.112,4.437,9.987,7.218,16.5,7.218c12.406,0,22.5-10.094,22.5-22.5V161.667C246,134.281,223.72,112,196.333,112z M234,269.5
   c0,5.79-4.71,10.5-10.5,10.5s-10.5-4.71-10.5-10.5V169h-18v111h-90V169H87v100.5c0,5.79-4.71,10.5-10.5,10.5S66,275.29,66,269.5
   V161.667C66,140.897,82.897,124,103.667,124h13.488l32.808,71.35L182.842,124h13.491c20.77,0,37.667,16.897,37.667,37.667V269.5z"
            />
        </svg>
    );
};

const PatientIcon = ({ height, width }) => {
    return (
        <svg
            width={height}
            height={width}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};

const AdminIcon = ({ height, width }) => {
    return (
        <svg
            fill="#000000"
            width={height}
            height={width}
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1556.611 1920c-54.084 0-108.168-20.692-149.333-61.857L740.095 1190.96c-198.162 41.712-406.725-19.269-550.475-163.019C14.449 852.771-35.256 582.788 65.796 356.27l32.406-72.696 390.194 390.193c24.414 24.305 64.266 24.305 88.68 0l110.687-110.686c11.824-11.934 18.283-27.59 18.283-44.34 0-16.751-6.46-32.516-18.283-44.34L297.569 84.207 370.265 51.8C596.893-49.252 866.875.453 1041.937 175.515c155.026 155.136 212.833 385.157 151.851 594.815l650.651 650.651c39.961 39.852 61.967 92.95 61.967 149.443 0 56.383-22.006 109.482-61.967 149.334l-138.275 138.385c-41.275 41.165-95.36 61.857-149.553 61.857Z"
                fill-rule="evenodd"
            />
        </svg>
    );
};

const ReceptionistIcon = ({ height, width }) => {
    return (
        <svg
            fill="#000000"
            height={height}
            width={width}
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
        >
            <g>
                <g>
                    <path
                        d="M456.092,482.575c-4.876,0-8.828,3.952-8.828,8.828v2.943H318.672l27.289-45.481c1.325-2.209,1.62-4.888,0.805-7.333
			l-6.188-18.561l18.561,6.188c4.173,1.39,8.722-0.498,10.687-4.427l31.457-62.914c27.575,17.148,45.98,47.711,45.98,82.505
			c0,4.875,3.951,8.828,8.828,8.828c4.876,0,8.828-3.952,8.828-8.828c0-63.279-51.48-114.759-114.759-114.759h-36.558
			c27.365-18.532,45.386-49.868,45.386-85.333v-82.391c0-56.788-46.2-102.988-102.989-102.988c-10.272,0-20.194,1.518-29.562,4.331
			c-1.834-4.114-2.806-8.575-2.806-13.159c0-17.848,14.521-32.368,32.368-32.368s32.368,14.52,32.368,32.368
			c0,4.875,3.951,8.828,8.828,8.828c4.876,0,8.828-3.952,8.828-8.828C306.023,22.44,283.583,0,256,0s-50.023,22.44-50.023,50.023
			c0,6.837,1.377,13.51,4.027,19.689c-33.76,16.924-56.992,51.86-56.992,92.127v82.391c0,35.466,18.02,66.801,45.386,85.333h-36.558
			c-63.278,0-114.759,51.48-114.759,114.759v58.851c0,4.875,3.951,8.828,8.828,8.828h400.184c4.876,0,8.828-3.952,8.828-8.828
			v-11.77C464.92,486.527,460.968,482.575,456.092,482.575z M324.108,347.218l-28.808,57.616l-7.385-22.155
			c-0.405-1.216-1.053-2.28-1.867-3.166c1.475-3.209,2.32-6.764,2.32-10.52v-14.124c0-2.666-0.42-5.235-1.189-7.651H324.108z
			 M170.667,161.839c0-47.053,38.28-85.333,85.333-85.333s85.333,38.28,85.333,85.333v14.072
			c-29.904-4.297-52.966-30.077-52.966-61.153c0-4.875-3.951-8.828-8.828-8.828s-8.828,3.952-8.828,8.828
			c0,38.554-44.126,70.275-100.046,73.321V161.839z M170.667,244.23v-38.494c29.948-1.469,57.903-10.367,79.481-25.472
			c12.553-8.786,22.235-19.134,28.712-30.474c11.73,23.78,35.014,40.879,62.473,43.928v50.511c0,47.053-38.28,85.333-85.333,85.333
			S170.667,291.283,170.667,244.23z M270.713,354.869v14.124c0,4.218-3.432,7.651-7.651,7.651h-14.124
			c-4.218,0-7.651-3.432-7.651-7.651v-14.124c0-4.218,3.432-7.651,7.651-7.651h14.124
			C267.28,347.218,270.713,350.651,270.713,354.869z M224.821,347.218c-0.767,2.415-1.189,4.985-1.189,7.651v14.124
			c0,3.756,0.845,7.312,2.32,10.52c-0.813,0.887-1.462,1.951-1.867,3.166l-7.385,22.155l-28.809-57.616H224.821z M64.736,494.345
			v-50.023c0-34.794,18.405-65.357,45.981-82.506l31.457,62.914c1.964,3.929,6.518,5.814,10.687,4.427l18.561-6.188l-6.188,18.561
			c-0.814,2.445-0.52,5.124,0.805,7.333l27.288,45.482H64.736z M213.918,494.345l-30.651-51.083l10.486-31.459
			c1.057-3.172,0.232-6.669-2.133-9.034s-5.86-3.19-9.035-2.133l-28.047,9.349l-28.04-56.081c10.96-4.3,22.873-6.687,35.34-6.687
			h6.315v0.001l73.563,147.126H213.918z M227.479,426.39c0.676-0.816,1.23-1.751,1.585-2.817l10.38-31.139
			c2.935,1.193,6.136,1.864,9.494,1.864h14.124c3.358,0,6.559-0.672,9.494-1.864l10.38,31.139c0.355,1.066,0.91,2.002,1.585,2.819
			L256,483.433L227.479,426.39z M270.283,494.345l73.563-147.126h6.315c12.467,0,24.378,2.387,35.34,6.687l-28.04,56.081
			l-28.047-9.349c-3.17-1.056-6.67-0.233-9.035,2.133c-2.365,2.365-3.19,5.862-2.133,9.034l10.486,31.459l-30.651,51.082H270.283z"
                    />
                </g>
            </g>
        </svg>
    );
};

export {
    MediHeavenIcon,
    OptionIcon,
    PhysicianIcon,
    PatientIcon,
    AdminIcon,
    ReceptionistIcon,
};
