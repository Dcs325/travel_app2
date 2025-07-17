import React, { useState } from 'react';
import './UserProfileModal.css';

const DropdownWithAdd = ({ label, options, value, setValue, placeholder, isMulti, id, addPlaceholder = "Add new" }) => {
    const [custom, setCustom] = useState('');
    const handleChange = (e) => {
        if (isMulti) {
            const selected = Array.from(e.target.selectedOptions, o => o.value);
            setValue(selected);
        } else {
            setValue(e.target.value);
        }
    };
    const handleAdd = () => {
        if (!custom) return;
        if (isMulti) {
            // For multi-select, ensure we're working with an array
            const currentValues = Array.isArray(value) ? value : [];
            setValue([...currentValues, custom]);
        } else {
            // For single-select, pass the value directly
            setValue(custom);
        }
        setCustom('');
    };
    return (
        <div className="user-profile-card-form-row">
            <label htmlFor={id}>{label}</label>
            <div>
                <select
                    id={id}
                    name={id}
                    multiple={isMulti}
                    value={value}
                    onChange={handleChange}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <input
                    id={`${id}-add`}
                    name={`${id}-add`}
                    type="text"
                    value={custom}
                    onChange={e => setCustom(e.target.value)}
                    placeholder={addPlaceholder}
                />
                <button type="button" onClick={handleAdd}>
                    Add
                </button>
            </div>
        </div>
    );
};

const UserProfileCard = ({
    formSkills,
    setFormSkills,
    formInterests,
    setFormInterests,
    formEducation,
    setFormEducation,
    formWorkExperience,
    setFormWorkExperience,
    formCareerAspirations,
    setFormCareerAspirations,
    formSalaryExpectations,
    setFormSalaryExpectations,
    formLocationState,
    setFormLocationState,
    formLocationCity,
    setFormLocationCity,
    formPreferredWorkEnvironments,
    setFormPreferredWorkEnvironments,
    handleProfileUpdate,
    handleEnvironmentChange,
    skillOptions = [],
    interestOptions = [],
    educationOptions = [],
    aspirationOptions = [],
    environmentOptions = ['remote', 'startup', 'corporate', 'hybrid'],
}) => {
    const usStates = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
        'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
        'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
        'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
        'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    return (
        <div className="user-profile-card-container">
            <div className="user-profile-card-left">
                <h2>New user?</h2>
                <p>Use the form below to create your account.</p>
            </div>
            <div className="user-profile-card-right">
                <form onSubmit={handleProfileUpdate} className="user-profile-card-form">
                    <DropdownWithAdd
                        id="skills"
                        label="Skills"
                        options={skillOptions}
                        value={formSkills ? formSkills.split(',').map(s => s.trim()).filter(Boolean) : []}
                        setValue={vals => setFormSkills(vals.join(', '))}
                        placeholder="Select or add skills"
                        isMulti
                        addPlaceholder="Add new skill"
                    />
                    <DropdownWithAdd
                        id="interests"
                        label="Interests"
                        options={interestOptions}
                        value={formInterests ? formInterests.split(',').map(s => s.trim()).filter(Boolean) : []}
                        setValue={vals => setFormInterests(vals.join(', '))}
                        placeholder="Select or add interests"
                        isMulti
                        addPlaceholder="Add new interest"
                    />
                    <DropdownWithAdd
                        id="education"
                        label="Education"
                        options={educationOptions}
                        value={formEducation}
                        setValue={setFormEducation}
                        placeholder="Select or add education"
                        isMulti={false}
                        addPlaceholder="Add new education"
                    />
                    <div className="user-profile-card-form-row">
                        <label htmlFor="workExperience">Work Experience</label>
                        <textarea
                            id="workExperience"
                            name="workExperience"
                            value={formWorkExperience}
                            onChange={e => setFormWorkExperience(e.target.value)}
                            placeholder="Describe your relevant work experience"
                        />
                    </div>
                    <div className="user-profile-card-form-row">
                        <label htmlFor="locationState">Location</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <select
                                id="locationState"
                                name="locationState"
                                value={formLocationState}
                                onChange={e => setFormLocationState(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.7rem 1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    background: '#fafbfc'
                                }}
                            >
                                <option value="">Select State</option>
                                {usStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <input
                                id="locationCity"
                                name="locationCity"
                                type="text"
                                value={formLocationCity}
                                onChange={e => setFormLocationCity(e.target.value)}
                                placeholder="Enter City"
                                style={{
                                    flex: 1,
                                    padding: '0.7rem 1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    background: '#fafbfc'
                                }}
                            />
                        </div>
                    </div>
                    <DropdownWithAdd
                        id="aspirations"
                        label="Career Aspirations"
                        options={aspirationOptions}
                        value={formCareerAspirations ? formCareerAspirations.split(',').map(s => s.trim()).filter(Boolean) : []}
                        setValue={vals => setFormCareerAspirations(vals.join(', '))}
                        placeholder="Select or add aspirations"
                        isMulti
                        addPlaceholder="Add new aspiration"
                    />
                    <div className="user-profile-card-form-row">
                        <label htmlFor="salaryExpectations">Salary Expectations (USD/year):</label>
                        <input
                            id="salaryExpectations"
                            name="salaryExpectations"
                            type="number"
                            value={formSalaryExpectations || ''}
                            onChange={e => {
                                const value = e.target.value;
                                if (value === '') {
                                    setFormSalaryExpectations('');
                                } else {
                                    const numValue = parseInt(value, 10);
                                    if (!isNaN(numValue)) {
                                        setFormSalaryExpectations(numValue);
                                    }
                                }
                            }}
                            placeholder="e.g., 80000"
                            min="0"
                        />
                    </div>
                    {/* Add more fields as needed */}
                    <div className="user-profile-card-form-row">
                        <button type="submit" className="user-profile-card-btn">Save Profile</button>
                    </div>
                </form>
            </div>
            <div className="user-profile-card-accent"></div>
        </div>
    );
};

export default UserProfileCard; 