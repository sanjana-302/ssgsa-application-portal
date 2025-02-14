import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AcademicRecordType } from '../../types'
import { ApplicationData } from '../../classes/application_data'
import ProceedButtons from './ProceedButtons'
import { updateApplicationData } from '../../pages/api/step2'
import { useAuth } from '../../context/AuthUserContext'

type RecordDataType = {
  [key: number]: {
    category: number
    branch: string
    collegeName: string
    duration: number
    completionYear: number
    percentage: string
  }
}

type Props = {
  applicationData: ApplicationData
  status: Number
  setStatus: Dispatch<SetStateAction<Number>>
}

const defaultRecord = {
  category: 0,
  branch: '',
  collegeName: '',
  duration: 1,
  completionYear: 2022,
  percentage: '',
}

const Step2 = ({ applicationData, status, setStatus }: Props) => {
  const { authUser } = useAuth()
  const [totalDegree, setTotalDegree] = useState<number>(1)
  const [academicData, setAcademicData] = useState<RecordDataType>({
    0: defaultRecord,
  })
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (applicationData.academic_record) {
      let academic_record: RecordDataType = {}
      let total: number = 0
      Object.keys(applicationData.academic_record).map((key, index) => {
        let category: number = 0
        if (key == 'Doctoral Degree') category = 6
        else if (key == "Master's Degree") category = 5
        else if (key == "Bachelor's Degree") category = 4
        else if (key == 'Diploma') category = 3
        else if (key == 'XII Class') category = 2
        else if (key == 'X Class') category = 1

        academic_record[index] = {
          category: category,
          ...applicationData.academic_record[key],
        }
        total = total + 1
      })
      setTotalDegree(total)
      setAcademicData(academic_record)
    }
  }, [applicationData])

  // return True if category is bachelor's, diploma, XII or X
  const requiredCondition = (key: number) =>
    academicData[key].category == 1 ||
    academicData[key].category == 2 ||
    academicData[key].category == 3 ||
    academicData[key].category == 4

  const checkAllFields = (key: number) =>
    academicData[key].branch &&
    academicData[key].collegeName &&
    academicData[key].completionYear &&
    academicData[key].duration &&
    academicData[key].percentage

  const getAcademicRecord = () => {
    let academicRecord: AcademicRecordType = {}
    Object.keys(academicData).map((key) => {
      if (academicData[key].category == 0) return
      let category: string = ''
      if (academicData[key].category == 6) category = 'Doctoral Degree'
      else if (academicData[key].category == 5) category = "Master's Degree"
      else if (academicData[key].category == 4) category = "Bachelor's Degree"
      else if (academicData[key].category == 3) category = 'Diploma'
      else if (academicData[key].category == 2) category = 'XII Class'
      else if (academicData[key].category == 1) category = 'X Class'
      academicRecord[category] = {
        branch: academicData[key].branch,
        collegeName: academicData[key].collegeName,
        duration: academicData[key].duration,
        completionYear: academicData[key].completionYear,
        percentage: academicData[key].percentage,
      }
    })
    return academicRecord
  }

  const nextStep = () => {
    setError('')
    if (totalDegree >= 3) {
      // flag checks degrees X, XII/Diploma and Bachelor's are filled or not
      // flag ranges from 0 to 7 acc to it's boolean format as shown:
      // <X digit    XII/Diploma digit    Bachelor's digit>
      // <   1             1                   1          > indicates flag = 7 and all 3 degree's are filled
      let flag = 0
      let totalCourseDuration = 0
      for (let key = 0; key < totalDegree; key++) {
        if (academicData[key].category == 1) {
          if (checkAllFields(key)) flag += 4
          else {
            setError('All fields in X are required')
            flag = -1
            break
          }
        } else if (
          academicData[key].category == 2 ||
          academicData[key].category == 3
        ) {
          if (checkAllFields(key)) flag += 2
          else {
            setError('All fields in XII/Diploma are required')
            flag = -1
            break
          }
        } else if (academicData[key].category == 4) {
          if (checkAllFields(key)) {
            totalCourseDuration += academicData[key].duration
            flag += 1
          } else {
            setError("All fields in Bachelor's are required")
            flag = -1
            break
          }
        } else if (academicData[key].category == 5) {
          if (checkAllFields(key))
            totalCourseDuration += academicData[key].duration
        }
      }

      if (flag == -1) return
      if (flag == 7) {
        if (totalCourseDuration >= 4) {
          let academicRecord: AcademicRecordType = getAcademicRecord()
          if (applicationData.form_status == 2) {
            updateApplicationData(authUser.id, academicRecord, 3)
            setStatus(3)
          } else {
            updateApplicationData(
              authUser.id,
              academicRecord,
              applicationData.form_status,
            )
            setStatus(3)
          }
        } else
          setError('Please check eligibility criteria or provide correct data')
      } else setError("X, XII/Diploma and bachelor's degrees are required")
    } else setError("X, XII/Diploma and bachelor's degrees are required")
  }

  const previousStep = () => {
    setStatus(1)
  }

  const saveInformation = () => {
    let academicRecord: AcademicRecordType = getAcademicRecord()
    updateApplicationData(
      authUser.id,
      academicRecord,
      applicationData.form_status,
    )
  }

  return (
    <div>
      <div className="bg-gray-200 rounded-3xl py-5 px-3 sm:py-10 sm:px-10">
        <p className="text-xs sm:text-sm md:text-base text-red-850 pl-2">
          Note: Remember to save your information at frequent intervals.
        </p>
        <div>
          {Object.keys(academicData).map((key) => (
            <div className="my-10" key={Number(key)}>
              <div className="p-2">
                <p className="font-bold text-lg md:text-xl">Academic Record</p>
                <select
                  name="Category"
                  value={academicData[Number(key)].category}
                  onChange={(e) =>
                    setAcademicData((prevDegree: RecordDataType) => ({
                      ...prevDegree,
                      [Number(key)]: {
                        ...prevDegree[Number(key)],
                        category: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full rounded-xl p-3"
                >
                  <option label="Select Category" value={0} />
                  <option label="Doctoral Degree" value={6} />
                  <option label="Master's Degree" value={5} />
                  <option label="Bachelor's Degree" value={4} />
                  <option label="Diploma" value={3} />
                  <option label="XII Class" value={2} />
                  <option label="X Class" value={1} />
                </select>
              </div>
              <div className="p-2">
                <p className="md:text-lg">
                  Major/Branch
                  {requiredCondition(Number(key)) ? (
                    <span className="text-red-850 font-black">*</span>
                  ) : null}
                </p>
                <input
                  name="Branch"
                  type="text"
                  value={academicData[Number(key)].branch}
                  onChange={(e) =>
                    setAcademicData((prevDegree: RecordDataType) => ({
                      ...prevDegree,
                      [Number(key)]: {
                        ...prevDegree[Number(key)],
                        branch: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl p-2 mt-1"
                />
              </div>
              <div className="p-2">
                <p className="md:text-lg leading-none">
                  Name Of College/University
                  {requiredCondition(Number(key)) ? (
                    <span className="text-red-850 font-black">*</span>
                  ) : null}
                </p>
                <input
                  name="College Name"
                  type="email"
                  value={academicData[Number(key)].collegeName}
                  onChange={(e) =>
                    setAcademicData((prevDegree: RecordDataType) => ({
                      ...prevDegree,
                      [Number(key)]: {
                        ...prevDegree[Number(key)],
                        collegeName: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl p-2 mt-1"
                />
              </div>
              <div className="p-2">
                <p className="md:text-lg leading-none">
                  Course Duration
                  {requiredCondition(Number(key)) ? (
                    <span className="text-red-850 font-black">*</span>
                  ) : null}{' '}
                  <span className="text-xs md:text-sm">(number of years)</span>
                </p>
                <input
                  name="Duration"
                  type="number"
                  value={academicData[Number(key)].duration}
                  onChange={(e) =>
                    setAcademicData((prevDegree: RecordDataType) => ({
                      ...prevDegree,
                      [Number(key)]: {
                        ...prevDegree[Number(key)],
                        duration: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full rounded-xl p-2 mt-1"
                />
              </div>
              <div className="p-2">
                <p className="md:text-lg">
                  Year/Expected Year of Completion
                  {requiredCondition(Number(key)) ? (
                    <span className="text-red-850 font-black">*</span>
                  ) : null}
                </p>
                <input
                  name="Comletion Year"
                  type="number"
                  value={academicData[Number(key)].completionYear}
                  onChange={(e) =>
                    setAcademicData((prevDegree: RecordDataType) => ({
                      ...prevDegree,
                      [Number(key)]: {
                        ...prevDegree[Number(key)],
                        completionYear: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full rounded-xl p-2 mt-1"
                />
              </div>
              <div className="p-2">
                <p className="md:text-lg">
                  Percentage/CGPA
                  {requiredCondition(Number(key)) ? (
                    <span className="text-red-850 font-black">*</span>
                  ) : null}{' '}
                  <span className="text-xs md:text-sm">
                    (Please write your score as numerator and maximum score as
                    denominator)
                  </span>
                </p>
                <input
                  name="Percentage"
                  type="text"
                  value={academicData[Number(key)].percentage}
                  onChange={(e) =>
                    setAcademicData((prevDegree: RecordDataType) => ({
                      ...prevDegree,
                      [Number(key)]: {
                        ...prevDegree[Number(key)],
                        percentage: e.target.value,
                      },
                    }))
                  }
                  className="w-full rounded-xl p-2 mt-1"
                />
              </div>
            </div>
          ))}
        </div>
        <p
          className={`text-xs sm:text-sm md:text-base font-extrabold w-max pr-2 pl-2 ${
            totalDegree < 6
              ? 'text-blue-850 cursor-pointer'
              : 'text-blue-860 cursor-not-allowed'
          }`}
          onClick={() => {
            if (totalDegree < 6) {
              setAcademicData((prevRecord: RecordDataType) => ({
                ...prevRecord,
                [totalDegree]: defaultRecord,
              }))
              setTotalDegree((prevTotal: number) => prevTotal + 1)
            }
          }}
        >
          Add a Degree +
        </p>
      </div>
      <ProceedButtons
        status={status}
        formStatus={applicationData.form_status}
        previousStep={previousStep}
        nextStep={nextStep}
        saveInformation={saveInformation}
        error={error}
      />
    </div>
  )
}

export default Step2
