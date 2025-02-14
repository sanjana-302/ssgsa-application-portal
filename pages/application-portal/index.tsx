import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from '../../firebase'
import PortalLayout from '../../layouts/application-portal'

export default function Portal() {
  const router = useRouter()
  const [firstCheck, setFirstCheck] = useState<boolean>(false)
  const [secondCheck, setSecondCheck] = useState<boolean>(false)
  const [thirdCheck, setThirdCheck] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Listen for changes on authUser, redirect if needed
  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        setFirstCheck(true)
        setSecondCheck(true)
        setThirdCheck(true)
      }
    })
  }, [])

  const proceed = () => {
    setError('')
    if (firstCheck && secondCheck && thirdCheck) {
      router.push('/application-portal/application')
    } else setError('Please check eligibility criteria first.')
  }

  return (
    <PortalLayout>
      <div className="my-10 mx-10 sm:mx-20 lg:mx-28 xl:mx-40">
        <div className="mb-10">
          {new Date() <
          new Date(process.env.NEXT_PUBLIC_APPLICATION_START_DATE) ? (
            <div className="bg-red-200 text-2xl text-red-850 text-center font-bold rounded-3xl p-2 pl-6 mb-5">
              Application has not started yet. Please check eligibility criteria
              and be ready with your documents.
            </div>
          ) : new Date() >
            new Date(process.env.NEXT_PUBLIC_APPLICATION_END_DATE) ? (
            <div className="bg-red-200 text-2xl text-red-850 text-center font-bold rounded-3xl p-2 pl-6 mb-5">
              Application Portal is closed. We are not accepting more responses!
            </div>
          ) : null}
        </div>
        <div className="mb-10">
          <h1 className="text-2xl text-center text-blue-850 font-black">
            Eligibility Criteria
          </h1>

          <h3 className="my-2">
            Check your eligibility criteria, and proceed to application form if
            you are completing below mentioned points:
          </h3>
          <div className="pl-5 my-2 font-semibold">
            <div
              className={`flex items-center border-4 p-2 ${
                firstCheck ? 'border-green-800' : 'border-red-850'
              } rounded-2xl`}
            >
              <input
                checked={firstCheck}
                onClick={() => setFirstCheck(!firstCheck)}
                type="checkbox"
                className="my-5 text-lg"
              />
              <label className="pl-5 text-blue-850">
                I am currently enrolled at Aligarh Muslim University or an
                alumnus
              </label>
            </div>
            <br />
            <div
              className={`flex items-center border-4 p-2 ${
                secondCheck ? 'border-green-800' : 'border-red-850'
              } rounded-2xl`}
            >
              <input
                checked={secondCheck}
                onClick={() => setSecondCheck(!secondCheck)}
                type="checkbox"
                className="my-5 text-lg"
              />
              <label className="pl-5 text-blue-850">
                I am registered for the final or penultimate year of a 4 (or
                more) year Bachelors program
                <br />
                <span className="flex justify-center">OR</span>I have completed
                a 3 year Bachelor&apos;s program and am currently enrolled in a
                master&apos;s program.
                <br />
                <span className="flex justify-center text-sm">
                  Note: At least one of your Bachelor&apos;s or master&apos;s
                  degree must be from AMU.
                </span>
              </label>
            </div>
            <br />
            <div
              className={`flex items-center border-4 p-2 ${
                thirdCheck ? 'border-green-800' : 'border-red-850'
              } rounded-2xl`}
            >
              <input
                checked={thirdCheck}
                onClick={() => setThirdCheck(!thirdCheck)}
                type="checkbox"
                className="my-5 text-lg"
              />
              <label className="pl-5 text-blue-850">
                I understand SSGSA takes plagiarism/forgery seriously and it
                will be severely dealt with. This may lead to disqualification
                of my application
              </label>
            </div>
          </div>

          <p className="mt-5 ">
            Note:{' '}
            <span className="text-sm">
              Be ready with scanned images of original documents supporting your
              academic credentials or your achievements.{' '}
              <span className="text-red-850">
                If you have not scanned your documents, first scan them and
                return later.
              </span>
            </span>
          </p>
        </div>

        <div>
          <h1 className="text-2xl text-center text-blue-850 font-black">
            Instructions
          </h1>
          <p className="my-5 text-lg">
            The application form is divided into 6 parts.
            <br />
            <br />
            You can view a step only after you have successfully completed all
            the preceding steps. However, you can go back to any of the{' '}
            <span className="underline">completed</span> steps to make any
            changes before final submission.
            <br />
            <br />
            Note that once you submit the application in Step 6, you can still
            edit it before the deadline.
            <br />
            <br />
            Questions marked <span className="text-red-850 font-black">
              *
            </span>{' '}
            are mandatory.
            <br />
            <br />
            Your entered information will be saved after successful completion
            of each step. However, if you go back{' '}
            <span className="underline">without saving your information</span>,
            your entered data may be lost.
            <br />
            <br />
            You will be able to review the information entered by you before
            submission of the form.
            <br />
            <br />
            <span className="text-sm">
              Note: The SSGSA portal functions best with Google Chrome and
              Firefox browsers. Please read the{' '}
              <Link href="/portal">
                {/* Add link for faq portal */}
                <a className="text-blue-800 underline font-black">FAQs</a>
              </Link>{' '}
              before contacting the SSGSA team.
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center">
          {error ? (
            <div className="bg-red-200 rounded-3xl p-2 pl-6 mb-5">
              <p>
                <span className="font-bold">Error:</span> {error}
              </p>
            </div>
          ) : null}
          <button
            className={`text-white text-base md:text-lg py-2 px-4 rounded-3xl ${
              new Date() <
                new Date(process.env.NEXT_PUBLIC_APPLICATION_START_DATE) ||
              new Date() >
                new Date(process.env.NEXT_PUBLIC_APPLICATION_END_DATE)
                ? 'bg-red-860 cursor-not-allowed'
                : 'bg-red-850'
            }`}
            onClick={
              new Date() <
                new Date(process.env.NEXT_PUBLIC_APPLICATION_START_DATE) ||
              new Date() >
                new Date(process.env.NEXT_PUBLIC_APPLICATION_END_DATE)
                ? null
                : proceed
            }
          >
            Proceed to the Application Form
          </button>
        </div>
      </div>
      <p className="text-sm text-center mx-5 sm:mx-10 lg:mx-20">
        If you encounter any error during application process, please contact us
        at{' '}
        <a className="text-blue-800 underline font-black">contact@ssgsa.us</a>{' '}
        or{' '}
        <a className="text-blue-800 underline font-black">
          developers@ssgsa.us
        </a>
        , describing your problem{' '}
        <span className="underline">with a screenshot of the error</span>
      </p>
    </PortalLayout>
  )
}
