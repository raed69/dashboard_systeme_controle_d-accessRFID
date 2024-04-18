import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  margin: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const FormInput = styled.input`
  width: 20%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const SuccessButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

const TimeRangeInput = styled.input`
  width: calc(20% - 5px);
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const ScheduleContainer = styled.div`
  margin-bottom: 20px;
`;

const DaysContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const DayLabel = styled.label`
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const TimeContainer = styled.div`
  margin-top: 10px;
`;

const TimeRangeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AddTimeButton = styled(SuccessButton)`
  margin-top: 10px;
  background-color: #ffc107;
  &:hover {
    background-color: #e0a800;
  }
`;

const RemoveButton = styled(Button)`
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c82333;
  }
`;

const Separator = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
`;

const App = () => {
  const [timezone, setTimezone] = useState('');
  const [scheduledTimes, setScheduledTimes] = useState([
    {
      jours: {
        lundi: false,
        mardi: false,
        mercredi: false,
        jeudi: false,
        vendredi: false,
        samedi: false,
        dimanche: false
      },
      timeslot: [{ heure_entree: '', heure_sortie: '' }]
    }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDayChange = (index, updatedDays) => {
    const updatedScheduledTimes = [...scheduledTimes];
    updatedScheduledTimes[index].jours = updatedDays;
    setScheduledTimes(updatedScheduledTimes);
  };

  const handleTimeChange = (index, updatedTime) => {
    const updatedScheduledTimes = [...scheduledTimes];
    updatedScheduledTimes[index].timeslot = updatedTime;
    setScheduledTimes(updatedScheduledTimes);
  };

  const handleAddSchedule = () => {
    const newSchedule = {
      jours: {
        lundi: false,
        mardi: false,
        mercredi: false,
        jeudi: false,
        vendredi: false,
        samedi: false,
        dimanche: false
      },
      timeslot: [{ heure_entree: '', heure_sortie: '' }]
    };
    setScheduledTimes([...scheduledTimes, newSchedule]);
  };

  const handleRemoveSchedule = (index) => {
    const updatedScheduledTimes = [...scheduledTimes];
    updatedScheduledTimes.splice(index, 1);
    setScheduledTimes(updatedScheduledTimes);
  };

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataToSend = scheduledTimes.map((schedule) => ({
        nom: timezone,
        jours: Object.entries(schedule.jours).map(([day, value]) => ({ [day]: value })),
        timeslot: schedule.timeslot
      }));

      // Make a POST request to your backend server
      const response = await axios.post('http://localhost:5000/timezone/creer', dataToSend);

      // Handle success
      setSuccessMessage('Timezone configuration saved successfully!');
      setErrorMessage('');

    } catch (error) {
      // Handle error
      setErrorMessage('Error saving timezone configuration');
      setSuccessMessage('');
    }
  };

  const handleAddTime = (index) => {
    const updatedScheduledTimes = [...scheduledTimes];
    updatedScheduledTimes[index].timeslot.push({ heure_entree: '', heure_sortie: '' });
    setScheduledTimes(updatedScheduledTimes);
  };

  return (
    <Container>
      <Title>Timezone Configuration</Title>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Timezone Name:</FormLabel>
          <FormInput type="text" placeholder="Enter timezone" value={timezone} onChange={handleTimezoneChange} />
        </FormGroup>

        {scheduledTimes.map((schedule, index) => (
          <ScheduleContainer key={index}>
            <DaysContainer>
              {Object.entries(schedule.jours).map(([dayKey, dayValue]) => (
                <DayLabel key={dayKey}>
                  <input
                    type="checkbox"
                    checked={dayValue}
                    onChange={() => {
                      const updatedDays = { ...schedule.jours, [dayKey]: !schedule.jours[dayKey] };
                      handleDayChange(index, updatedDays);
                    }}
                  />
                  {dayKey}
                </DayLabel>
              ))}
            </DaysContainer>
            <TimeContainer>
              {schedule.timeslot.map((time, timeIndex) => (
                <TimeRange
                  key={timeIndex}
                  index={timeIndex}
                  time={time}
                  onTimeChange={(subIndex, updatedTime) => {
                    const updatedTimes = [...schedule.timeslot];
                    updatedTimes[subIndex] = updatedTime;
                    handleTimeChange(index, updatedTimes);
                  }}
                />
              ))}
              <AddTimeButton type="button" onClick={() => handleAddTime(index)}>Add Time</AddTimeButton>
              <RemoveButton type="button" onClick={() => handleRemoveSchedule(index)}>Remove Schedule</RemoveButton>
            </TimeContainer>
          </ScheduleContainer>
        ))}
        <Button type="submit">Save</Button>
      </Form>
      <SuccessButton onClick={handleAddSchedule}>Add Schedule</SuccessButton>
    </Container>
  );
};

const TimeRange = ({ index, time, onTimeChange }) => {
  const handleTimeChange = (field, value) => {
    onTimeChange(index, { ...time, [field]: value });
  };

  return (
    <TimeRangeWrapper>
      <FormLabel>Start Time:</FormLabel>
      <TimeRangeInput
        type="time"
        value={time.heure_entree}
        onChange={(e) => handleTimeChange('heure_entree', e.target.value)}
      />
      <FormLabel>End Time:</FormLabel>
      <TimeRangeInput
        type="time"
        value={time.heure_sortie}
        onChange={(e) => handleTimeChange('heure_sortie', e.target.value)}
      />
    </TimeRangeWrapper>
  );
};

export default App;
