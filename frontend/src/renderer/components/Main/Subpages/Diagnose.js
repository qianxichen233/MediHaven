import { Fragment, useEffect, useMemo, useState } from 'react';
import styles from './Diagnose.module.scss';
import { add_record, get_patient, get_record } from '../../../api/patient';
import { useMyContext } from '../../MyContext';
import MainButton from '../../UI/MainButton';
import Select from '../../UI/Select';
import { get_medicines } from '../../../api/medicine';
import Input from '../../UI/Input';
import { finish_schedule } from '../../../api/schedule';
import { calcAge } from '../../../utils/utils';

const medicine_types = [
    'Sedatives',
    'Diuretics',
    'Stimulants',
    'Antibiotics',
    'Muscle Relaxants',
    'Antihistamines',
    'Analgesics',
    'Antipyretics',
    'Antidepressants',
    'Vitamins/Supplements',
    'Topical',
    'Antivirals',
    'Respiratory',
    'Hormones',
    'Cardiovascular',
];

const validate = (medicineList) => {
    for (const medicine of medicineList) {
        if (!medicine.locked) return false;
    }
    return true;
};

const getSuggestion = (medicineList, typedValue) => {
    return medicineList
        .filter((medicine) => medicine.name.startsWith(typedValue))
        .slice(0, 5);
};

const Diagnose = (props) => {
    const { user } = useMyContext();

    const [record, setRecord] = useState();
    const [patient, setPatient] = useState();

    const [tabs, setTabs] = useState(Array(3).fill(false));

    const [diagnose, setDiagnose] = useState({
        encounter_summary: '',
        diagnose: '',
    });

    const [medicinesList, setMedicinesList] = useState([]);
    const [suggestList, setSuggestList] = useState({
        disabled: true,
        index: 0,
        suggestions: [],
    });

    const [addMedicineDisabled, setAddMedicineDisabled] = useState(false);

    const fetchData = async (SSN, id) => {
        const patient_result = await get_patient(SSN, user.role, user.email);
        const record_result = await get_record(id, user.email);
        setPatient(patient_result);
        setRecord(record_result);
    };

    useEffect(() => {
        fetchData(props.info.patient_SSN, props.info.patient_ID);
    }, []);

    useEffect(() => {
        setAddMedicineDisabled(!validate(medicinesList));
    }, [medicinesList]);

    const onCollapse = (index) => {
        setTabs((tabs) => {
            const newTabs = [...tabs];
            newTabs[index] = !newTabs[index];
            return newTabs;
        });
    };

    const onDiagnoseChange = (key, payload) => {
        if (key === 'medicines') {
            let medicines = [...diagnose.medicines];
            if (payload.action === 'add') {
                medicines.push(payload.medicine);
            } else {
                medicines = medicines.filter(
                    (item) => item !== payload.medicine,
                );
            }
            setDiagnose((diagnose) => {
                return {
                    ...diagnose,
                    [key]: medicines,
                };
            });
        } else {
            setDiagnose((diagnose) => {
                return {
                    ...diagnose,
                    [key]: payload,
                };
            });
        }
    };

    const addMedicine = () => {
        setMedicinesList((prev) => {
            return [
                ...prev,
                {
                    type: 'Sedatives',
                    list: [],
                    choose: '',
                    locked: false,
                    error: false,
                },
            ];
        });
    };

    const removeMedicine = (index) => {
        setMedicinesList((prev) => {
            const newlist = prev.filter((_, i) => i !== index);
            return newlist;
        });
    };

    const changeMedicineType = (index, type) => {
        setMedicinesList((prev) => {
            const newlist = [...prev];
            newlist[index].type = type;
            return newlist;
        });
    };

    const onMedicineLock = (index) => {
        if (!medicinesList[index].locked) {
            const name = medicinesList[index].choose;
            if (
                medicinesList[index].list.filter((item) => item.name === name)
                    .length === 0
            ) {
                setMedicinesList((prev) => {
                    const newlist = [...prev];
                    newlist[index].error = true;
                    return newlist;
                });
                return;
            }
        }

        setMedicinesList((prev) => {
            const newlist = [...prev];
            newlist[index].locked = !newlist[index].locked;
            return newlist;
        });
    };

    const onMedicineNameChange = (index, name, unset) => {
        if (name === '' || unset) {
            setSuggestList({
                disabled: true,
                index: 0,
                suggestions: [],
            });
        } else {
            const suggestions = getSuggestion(medicinesList[index].list, name);
            setSuggestList({
                disabled: false,
                index: index,
                suggestions: suggestions,
            });
        }

        setMedicinesList((prev) => {
            const newlist = [...prev];
            newlist[index].choose = name;
            newlist[index].error = false;
            return newlist;
        });
    };

    const fetchMedicines = async (index) => {
        let result = await get_medicines(medicinesList[index].type);
        result = result
            .map((item) => {
                item.name = item.name.toLowerCase();
                return item;
            })
            .sort((a, b) => (a.name > b.name ? 1 : -1));
        setMedicinesList((prev) => {
            const newlist = [...prev];
            newlist[index].list = result;
            newlist[index].choose = '';
            newlist[index].locked = false;
            return newlist;
        });
    };

    const onSubmit = async () => {
        const medicines = medicinesList.map((medicine) => medicine.choose);
        const data = {
            SSN: props.info.patient_SSN,
            patient_id: props.info.patient_ID,
            physician_id: props.info.physician_ID,
            medicines: medicines,
            encounter_summary: diagnose.encounter_summary,
            diagnose: diagnose.diagnose,
            email: user.email,
        };

        const result = await add_record(data);
        await finish_schedule(props.info.schedule_ID, user.email);
        // console.log(data);
        props.onFinished();
    };

    // console.log(record);
    console.log(patient);

    // console.log(medicinesList);
    // console.log(addMedicineDisabled);
    // console.log(suggestList);
    // console.log(props.info);

    let prescription = useMemo(() => {
        if (!record) return null;
        return [
            ...new Set(
                [].concat(...record.records.map((item) => item.medicines)),
            ),
        ];
    }, [record]);
    console.log(prescription);

    const allowSubmit =
        diagnose.diagnose !== '' &&
        diagnose.encounter_summary !== '' &&
        !addMedicineDisabled;

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <div>
                    <div
                        onClick={onCollapse.bind(this, 0)}
                        className={
                            styles.collapse +
                            ' ' +
                            (tabs[0] ? styles.active : '')
                        }
                    >
                        Prescription History
                    </div>
                    <div
                        className={
                            styles.wrapper +
                            ' ' +
                            (tabs[0] ? styles.active : '')
                        }
                    >
                        <div className={styles.inner}>
                            <div className={styles.medicines}>
                                {prescription &&
                                    prescription.map((medicine) => {
                                        return <span>{medicine}</span>;
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        onClick={onCollapse.bind(this, 1)}
                        className={
                            styles.collapse +
                            ' ' +
                            (tabs[1] ? styles.active : '')
                        }
                    >
                        Medical Records
                    </div>
                    <div
                        className={
                            styles.wrapper +
                            ' ' +
                            (tabs[1] ? styles.active : '')
                        }
                    >
                        <div className={styles.inner}>
                            <div className={styles.records}>
                                {record &&
                                    record.records.map((record) => {
                                        return (
                                            <div key={record.complete_date}>
                                                <span>
                                                    Diagnose Date:{' '}
                                                    {record.complete_date}
                                                </span>
                                                <div>
                                                    <span>
                                                        Encounter Summary:{' '}
                                                    </span>
                                                    <span>
                                                        {
                                                            record.encounter_summary
                                                        }
                                                    </span>
                                                </div>
                                                <div>
                                                    <span>Diagnose: </span>
                                                    <span>
                                                        {record.diagnosis}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span>Medicines: </span>
                                                    {record.medicines.map(
                                                        (medicine) => {
                                                            return (
                                                                <span
                                                                    key={
                                                                        medicine
                                                                    }
                                                                >
                                                                    {medicine}
                                                                </span>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        onClick={onCollapse.bind(this, 2)}
                        className={
                            styles.collapse +
                            ' ' +
                            (tabs[2] ? styles.active : '')
                        }
                    >
                        Diagnose
                    </div>
                    <div
                        className={
                            styles.wrapper +
                            ' ' +
                            (tabs[2] ? styles.active : '')
                        }
                    >
                        <div className={styles.inner}>
                            <div className={styles.medicineInput}>
                                <label>Medicines:</label>
                                <div>
                                    <MainButton
                                        background={
                                            addMedicineDisabled
                                                ? '#e0e0e0'
                                                : 'var(--primary-color)'
                                        }
                                        color="white"
                                        text="Add Medicine"
                                        width="150px"
                                        height="40px"
                                        onClick={addMedicine}
                                        disabled={addMedicineDisabled}
                                    />
                                    <div>
                                        {medicinesList.map(
                                            (medicine, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div
                                                            className={
                                                                styles.typelist
                                                            }
                                                        >
                                                            <Select
                                                                label="Type"
                                                                content={
                                                                    medicine.type
                                                                }
                                                                setContent={changeMedicineType.bind(
                                                                    this,
                                                                    index,
                                                                )}
                                                                width="250px"
                                                                height="40px"
                                                                size="24px"
                                                                list={
                                                                    medicine_types
                                                                }
                                                                noAny={true}
                                                            />
                                                            <div
                                                                className={
                                                                    styles.buttons
                                                                }
                                                            >
                                                                <MainButton
                                                                    background={
                                                                        medicine
                                                                            .list
                                                                            .length ===
                                                                        0
                                                                            ? 'var(--primary-color)'
                                                                            : 'orange'
                                                                    }
                                                                    color="white"
                                                                    text="SEARCH"
                                                                    width="150px"
                                                                    height="40px"
                                                                    onClick={fetchMedicines.bind(
                                                                        this,
                                                                        index,
                                                                    )}
                                                                />
                                                                <MainButton
                                                                    background="var(--secondary-color)"
                                                                    color="white"
                                                                    text="DELETE"
                                                                    width="150px"
                                                                    height="40px"
                                                                    onClick={removeMedicine.bind(
                                                                        this,
                                                                        index,
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={
                                                                styles.medicineSelect
                                                            }
                                                        >
                                                            <div>
                                                                <div>
                                                                    {medicine.locked ? (
                                                                        <div
                                                                            className={
                                                                                styles.lockedMedicine
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    medicine.choose
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <Input
                                                                                label="Medicine:"
                                                                                content={
                                                                                    medicine.choose
                                                                                }
                                                                                setContent={onMedicineNameChange.bind(
                                                                                    this,
                                                                                    index,
                                                                                )}
                                                                                width="200px"
                                                                                height="40px"
                                                                                size="24px"
                                                                                disabled={
                                                                                    medicine
                                                                                        .list
                                                                                        .length ===
                                                                                    0
                                                                                }
                                                                                error={
                                                                                    medicine.error
                                                                                }
                                                                            />
                                                                            {suggestList.disabled ===
                                                                                false &&
                                                                                suggestList.index ===
                                                                                    index && (
                                                                                    <div
                                                                                        className={
                                                                                            styles.suggestion
                                                                                        }
                                                                                    >
                                                                                        {suggestList
                                                                                            .suggestions
                                                                                            .length ===
                                                                                        0 ? (
                                                                                            <span
                                                                                                className={
                                                                                                    styles.notfound
                                                                                                }
                                                                                            >
                                                                                                Medicine
                                                                                                Not
                                                                                                Found
                                                                                            </span>
                                                                                        ) : (
                                                                                            suggestList.suggestions.map(
                                                                                                (
                                                                                                    suggestion,
                                                                                                ) => {
                                                                                                    return (
                                                                                                        <span
                                                                                                            key={
                                                                                                                suggestion.name
                                                                                                            }
                                                                                                            onClick={onMedicineNameChange.bind(
                                                                                                                null,
                                                                                                                index,
                                                                                                                suggestion.name,
                                                                                                                true,
                                                                                                            )}
                                                                                                        >
                                                                                                            {
                                                                                                                suggestion.name
                                                                                                            }
                                                                                                        </span>
                                                                                                    );
                                                                                                },
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <MainButton
                                                                    background={
                                                                        medicine
                                                                            .list
                                                                            .length ===
                                                                        0
                                                                            ? '#e0e0e0'
                                                                            : medicine.locked
                                                                            ? 'var(--secondary-color)'
                                                                            : 'var(--primary-color)'
                                                                    }
                                                                    color="white"
                                                                    text={
                                                                        medicine.locked
                                                                            ? 'EDIT'
                                                                            : 'CONFIRM'
                                                                    }
                                                                    width="150px"
                                                                    height="40px"
                                                                    onClick={onMedicineLock.bind(
                                                                        this,
                                                                        index,
                                                                    )}
                                                                    disabled={
                                                                        medicine
                                                                            .list
                                                                            .length ===
                                                                        0
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.textinput}>
                                <label>Encoutner Summary: </label>
                                <textarea
                                    rows={5}
                                    // cols={35}
                                    value={diagnose.encounter_summary}
                                    onChange={(e) =>
                                        onDiagnoseChange(
                                            'encounter_summary',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter encounter summary here..."
                                />
                            </div>
                            <div className={styles.textinput}>
                                <label>Diagnosis: </label>
                                <textarea
                                    rows={5}
                                    // cols={35}
                                    value={diagnose.diagnose}
                                    onChange={(e) =>
                                        onDiagnoseChange(
                                            'diagnose',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter diagnose here..."
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <MainButton
                                    background={
                                        !allowSubmit
                                            ? '#e0e0e0'
                                            : 'var(--primary-color)'
                                    }
                                    color="white"
                                    text="SUBMIT"
                                    width="150px"
                                    height="40px"
                                    onClick={onSubmit}
                                    disabled={!allowSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.patient}>
                <span></span>
                <div>
                    <div>
                        {patient ? (
                            <span>
                                {patient.First_Name + ' ' + patient.Last_Name}
                            </span>
                        ) : (
                            <div
                                className={styles.placeholder}
                                style={{ marginTop: '10px', fontSize: '32px' }}
                            >
                                placeholder
                            </div>
                        )}
                    </div>
                    <div>
                        {patient ? (
                            <>
                                <span>DOB: {patient.Date_Of_Birth}</span>
                                <span>
                                    Age: {calcAge(patient.Date_Of_Birth)}
                                </span>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                placeholder
                            </div>
                        )}
                    </div>
                    <div>
                        {patient ? (
                            <>
                                <span>Sex: </span>
                                <span>{patient.Sex}</span>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                placeholder
                            </div>
                        )}
                    </div>
                    <div>
                        {patient ? (
                            <>
                                <span>SSN: </span>
                                <span>{patient.SSN}</span>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                placeholder
                            </div>
                        )}
                    </div>
                    <div>
                        {patient ? (
                            <>
                                <span>Phone Number: </span>
                                <span>{patient.Phone_Number}</span>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                placeholder
                            </div>
                        )}
                    </div>
                    <div>
                        {patient ? (
                            <>
                                <span>Email: </span>
                                <span>{patient.Email}</span>
                            </>
                        ) : (
                            <div className={styles.placeholder}>
                                placeholder
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Diagnose;
