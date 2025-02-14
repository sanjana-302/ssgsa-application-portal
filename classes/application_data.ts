import { AcademicRecordType, AnswerType, DocumentsType } from '../types'
import firebase from '../firebase'

export class ApplicationData {
  name: string
  email: string
  contact: number
  gender: string
  enrollment: string
  nationality: string
  academic_record: AcademicRecordType
  documents: DocumentsType
  sop_answers: AnswerType
  form_status: number

  constructor(form_status: number = 1) {
    this.form_status = form_status
  }

  step1(
    name: string,
    email: string,
    contact: number,
    gender: string,
    enrollment: string,
    nationality: string,
  ) {
    this.name = name
    this.email = email
    this.contact = contact
    this.gender = gender
    this.enrollment = enrollment
    this.nationality = nationality
  }

  step2(academic_record: AcademicRecordType) {
    this.academic_record = academic_record
  }
  
  step3(sop_answers: AnswerType) {
    this.sop_answers = sop_answers
  }
  
  step4(documents: DocumentsType) {
    this.documents = documents
  }
}

export const applicationDataConverter = {
  toFirestore: (application_data: ApplicationData) => {
    return {}
  },

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions,
  ) => {
    let data = snapshot.data(options)
    let applicationData = new ApplicationData(data.form_status)
    applicationData.step1(
      data.name,
      data.email,
      data.contact,
      data.gender,
      data.enrollment,
      data.nationality,
    )
    if (data.form_status >= 2) {
      applicationData.step2(data.academic_record)
    }
    if (data.form_status >= 3) {
      applicationData.step3(data.sop_answers)
    }
    if (data.form_status >= 4) {
      applicationData.step4(data.documents)
    }
    return applicationData
  },
}
