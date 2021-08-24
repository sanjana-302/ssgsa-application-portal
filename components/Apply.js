import Image from "next/image";

const Apply = () => {
  return (
    <div className="mt-3 lg:mt-0 lg:ml-4 lg:w-1/3 bg-gray-100 shadow-lg border-2">
      <div className="mx-8 pt-3">
        <button className="px-10 py-1 block mx-auto border-2 border-gray shadow bg-red-850 font-black text-lg text-white text-center">
          APPLY
        </button>
        <p className="mx-auto font-black text-sm border-gray shadow text-red-850 text-center mt-8">
          Sponsor a student
        </p>
        <div className="mt-3 text-center">
          <Image src="/donate1.png" alt="Donate" width={280} height={30} />
        </div>
        <a href="#"></a>
        <p className="mx-auto font-black text-sm border-gray shadow text-red-850 text-center mt-8">
          Become a regular Patron
        </p>
        <div className="mt-3 text-center">
          <Image src="/donate2.png" alt="Donate" width={250} height={30} />
        </div>
        <p className="text-sm mt-8">
          By supporting students, you&apos;re becoming an active participant in
          building their careers. You can easily cancel or upgrade your
          contribution at any time.
        </p>
      </div>
      <button className="px-2 py-2 mt-8 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center">
        SSGSA results (2021-2022) announce
      </button>
      <button className="px-2 py-2 mt-3 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center">
        Pledge your support to SSGSA
      </button>
      <button className="px-2 py-2 mt-3 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center">
        Federation of Aligarh Alumni Associations(FAAA)
      </button>
      <button className="px-2 py-2 mt-3 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center">
        The Aligarh Muslim University
      </button>
      <button className="px-2 py-2 mt-3 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center">
        Join our Facebook Group
      </button>
      <button className="px-2 py-2 mt-3 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center">
        Press Release Statement of SSGSA Convention 2020
      </button>

      <div className="mx-4">
        <button className="px-2 py-2 mt-8 mb-8 w-full border-2 border-gray shadow-inner bg-red-850 text-sm text-white text-center rounded-tl-md rounded-br-md">
          Ask a Question
        </button>
      </div>
    </div>
  );
};

export default Apply;
