import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createApplicationData } from '../api/createApplicationData'
import { createUser } from '../api/createUser'
import firebase, { auth } from '../../firebase'
import PortalLayout from '../../layouts/application-portal'
import { useAuth } from '../../context/AuthUserContext'

const SignUp = () => {
  const { createUserWithEmailAndPassword } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [passwordOne, setPasswordOne] = useState<string>('')
  const [passwordTwo, setPasswordTwo] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [stream, setStream] = useState<string>('')
  const [gender, setGender] = useState<string>('Male')
  const [dob, setDOB] = useState<string>('')
  const [mobile, setMobile] = useState<number>()
  const [pwd, setPWD] = useState<string>('False')
  const [error, setError] = useState<string>('')
  const [pageReady, setPageReady] = useState<boolean>(false)

  // Listen for changes on authUser, redirect if needed
  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser) router.push('/application-portal/application')
      else setPageReady(true)
    })
  }, [])

  const onSubmit = (event) => {
    setError(null)
    //check if passwords match. If they do, create user in Firebase
    // and redirect to home page.
    if (passwordOne === passwordTwo)
      createUserWithEmailAndPassword(email, passwordOne)
        .then(async (result: firebase.auth.UserCredential) => {
          // add user data to firestore database
          createUser(
            result.user.uid,
            name,
            email,
            stream,
            gender,
            dob,
            mobile,
            pwd,
          )
          createApplicationData(result.user.uid)

          router.push('/application-portal/application')
        })
        .catch((error) => {
          setError(error.message)
        })
    else setError('Password do not match')
    event.preventDefault()
  }

  return (
    <PortalLayout>
      {pageReady ? (
        <div className="mx-4 sm:mx-12 lg:mx-20 mt-10 flex justify-center">
          <div>
            <h1 className="mb-4 bg-blue-850 text-xl sm:text-2xl lg:text-3xl text-center text-white font-extrabold py-2 px-6 sm:px-12 rounded-tl-3xl rounded-br-3xl">
              Sign Up
            </h1>

            {error ? (
              <div className="bg-red-200 rounded-3xl p-2 pl-6 mb-2">
                <p>
                  <span className="font-bold">Error:</span> {error}
                </p>
              </div>
            ) : null}

            <div className="bg-red-850 rounded-3xl p-2">
              <div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Name
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Email
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Stream
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Stream"
                    type="text"
                    value={stream}
                    onChange={(e) => setStream(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Gender
                  </p>
                  <select
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option label="Male" value="Male" />
                    <option label="Female" value="Female" />
                  </select>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Mobile
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Mobile"
                    type="number"
                    value={mobile}
                    onChange={(e) => setMobile(Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Date Of Birth
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Date Of Birth"
                    type="text"
                    value={dob}
                    onChange={(e) => setDOB(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    PWD
                  </p>
                  <select
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="PWD"
                    value={pwd}
                    onChange={(e) => setPWD(e.target.value)}
                  >
                    <option label="False" value="False" />
                    <option label="True" value="True" />
                  </select>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Password
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Password"
                    type="password"
                    value={passwordOne}
                    onChange={(e) => setPasswordOne(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-4 m-4">
                  <p className="col-span-2 sm:text-right text-white text-base md:text-lg">
                    Confirm Password
                  </p>
                  <input
                    className="col-span-7 sm:col-span-4 p-1 rounded"
                    name="Confirm Password"
                    type="password"
                    value={passwordTwo}
                    onChange={(e) => setPasswordTwo(e.target.value)}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    className="text-white text-base md:text-lg bg-blue-850 py-2 px-4 rounded-3xl"
                    onClick={onSubmit}
                  >
                    Submit
                  </button>
                </div>

                <br />
                <div className="flex justify-center">
                  <p className="text-white text-base md:text-lg">
                    Already have an account,{''}
                    <Link href="/application-portal/signin">
                      <a className="py-4 px-2 text-blue-850">Login Here</a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
    </PortalLayout>
  )
}

export default SignUp
