import React from "react";
import Image from 'next/image'
import Link from "next/link";

import { useRouter } from 'next/router';
// import Link from "next/link";



// Initially the entire api is being loaded on server by calling all the launches
// after, that complete html being served completely resulting in minimum loading time.

export async function getServerSideProps() { //Server Side Rendering
  const response = await fetch("https://api.spacexdata.com/v3/launches?limit=100");
  const launches = await response.json();

  return {
    props: {
      launches,
    },
  };
}

function LaunchCard({ launch }: { launch: any }) {
  return (
    <div className="max-w-sm bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">

  <a href={launch.links.article_link} target="_blank" rel="noopener noreferrer"/>
    <Image className="rounded-t-lg"
      width={300}
      height={300}
      loading="lazy"
      src={launch.links.mission_patch} alt={launch.mission_name} />
  {/* </Link> */}

      <div className="p-4">
        <a href={launch.links.article_link} target="_blank" rel="noopener noreferrer"/>
          <h5 className="mb-2 text-2xl font-bold text-purple-700 dark:text-white">
            {launch.mission_name} #{launch.flight_number}
          </h5>
          {/* </Link> */}

        <p className="mb-1 text-gray-700 font-bold text-xl dark:text-gray-400">Mission IDs: </p>
        <ul> <span><li> {launch.mission_id.join(", ")}</li></span></ul>
        <p className="mb-1 text-gray-700 font-bold text-xl dark:text-gray-400">Launch Year: {launch.launch_year}</p>
        <p className="mb-1 text-gray-700 font-bold text-xl dark:text-gray-400">
          Successful Launch: {launch.launch_success ? "Yes" : "No"}
        </p>
        {launch.rocket.first_stage.cores[0].land_success !== null && (
          <p className="mb-1 text-xl text-gray-700 font-bold dark:text-gray-400">
            Successful Landing: {launch.rocket.first_stage.cores[0].land_success ? "Yes" : "No"}
          </p>
        )}
      </div>

    </div>
  );
}

function Home({ launches }: { launches: any }) {
  const router = useRouter();
  const { query } = router;

  const selectedYear = query.year || undefined;
  const successfulLaunch = query.launch === 'true' ? true : query.launch === 'false' ? false : undefined;
  const successfulLanding = query.landing === 'true' ? true : query.landing === 'false' ? false : undefined;

  const handleYearFilter = (year:any) => {
    const newQuery = { ...query, year };
    router.push({ pathname: '/', query: newQuery });
  };


  //here we are using react router for the url data handeling and showing what user is requesting from the server
  const handleFilter = (key:any, value:any) => {
    const newQuery = { ...query };
    if (value === true) {
      newQuery[key] = 'true';
    } else if (value === false) {
      newQuery[key] = 'false';
    } else {
      delete newQuery[key];
    }
    router.push({ pathname: '/', query: newQuery });
  };

  const resetFilters = () => {
    // Clear all filters by removing them from the query
    const newQuery = { ...query };
    delete newQuery.year;
    delete newQuery.launch;
    delete newQuery.landing;
    router.push({ pathname: '/', query: newQuery });
  };

  const filteredLaunches = launches.filter((launch:any) => {
    // Filter by Launch Year
    const yearFilter = selectedYear ? launch.launch_year === selectedYear : true;

    // Filter by Successful Launch
    const successfulLaunchFilter =
      successfulLaunch === undefined ? true : launch.launch_success === successfulLaunch;

    // Filter by Successful Landing
    const successfulLandingFilter =
      successfulLanding === undefined ? true : launch.rocket.first_stage.cores[0].land_success === successfulLanding;

    return yearFilter && successfulLaunchFilter && successfulLandingFilter;
  });


  // rather than giving statically all the buttons of year
  // we have created a array 
  const years = Array.from({ length: 15 }, (_, index) => (2006 + index).toString());

  return (
    <div className="bg-gray-100 min-h-screen ">
        <div className="text-center mt-8">
          <h1 className="text-4xl font-bold text-purple-700 dark:text-white">SpaceX Launch Programs</h1>
        </div>
              
      <div className="flex flex-col sm:flex-row  ">
        {/* Left-hand side for filters with a lightweight background */}
        {/* <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">SpaceX Launch Programs</h1> */}

        <div className=" sm:w-1/4 p-6 bg-gray-100 dark:bg-gray-900   ">
         

          <div className="py-4 gap-4 mb-8    grid place-items-center ">
          <h1 className="text-2xl font-bold ">Filters</h1>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-white py-2">Launch Year</h2>
            <hr />
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 place-items-center  ">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearFilter(year)}
                  className={`bg-[hsl(83,42%,44%)] hover:bg-[#008631] w-24 md:w-12 xl:w-24 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover-bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-2 py-2 ${
                    selectedYear === year ? 'bg-[#00c04b] hover:bg-black-600 focus:ring-4 focus:ring-black-300 text-black' : ''
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            <h2 className="py-2 text-xl font-semibold text-gray-800 dark:text-white md:text-center">Successful Launch</h2>
            <div className="content-center grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              
               <button
                
                  onClick={() =>handleFilter('launch', true)}
                  className={`bg-[hsl(83,42%,44%)] hover:bg-[#008631] w-24 md:w-12 xl:w-24 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover-bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-2 py-2 ${
                    successfulLaunch === true ? 'bg-[#00c04b] hover:bg-black-600 focus:ring-4 focus:ring-black-300 text-black' : ''
                  }`}
                >
                  True
                </button>
                <button
                
                onClick={() =>handleFilter('launch', false)}
                className={`bg-[hsl(83,42%,44%)] hover:bg-[#008631] w-24 md:w-12 xl:w-24 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover-bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-2 py-2 ${
                  successfulLaunch === false ? 'bg-[#00c04b] hover:bg-black-600 focus:ring-4 focus:ring-black-300 text-black' : ''
                }`}
              >
                False 
              </button>
            </div>

            <h2 className="text-xl py-2 font-semibold text-gray-800 dark:text-white md:text-center">Successful Landing</h2>
            {/* brorbr wala */}
            <div className=" grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6 place-items-center">
              {/* <button
                onClick={() => handleFilter('landing', true)}
                className={`bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 text-white text-sm font-medium rounded-lg mx-4 px-4 py-2 ${
                  successfulLanding === true ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300' : ''
                }`}
              >
                True
                
              </button> */}
                <button
                
                onClick={() =>handleFilter('launch', true)}
                className={`bg-[hsl(83,42%,44%)] hover:bg-[#008631] w-24 md:w-12 xl:w-24 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover-bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-2 py-2 ${
                  successfulLanding === true ? 'bg-[#00c04b] hover:bg-black-600 focus:ring-4 focus:ring-black-300 text-black' : ''
                }`}
              >
                True
              </button>
              <button
                
                onClick={() =>handleFilter('launch', true)}
                className={`bg-[hsl(83,42%,44%)] hover:bg-[#008631] w-24  md:w-12 xl:w-24 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover-bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-2 py-2 ${
                  successfulLanding === false ? 'bg-[#00c04b] hover:bg-black-600 focus:ring-4 focus:ring-black-300 text-black' : ''
                }`}
              >
                False
              </button>
            </div>

            {/* Button to reset filters */}
            <button
              onClick={resetFilters}
              className="bg-[hsl(83,42%,44%)] hover:bg-[#008631] w-24  md:w-24 xl:w-36 lg:w-32 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover-bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-2 py-2"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Right-hand side for cards */}
        <div className="w-full sm:w-3/4 p-6 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLaunches.map((launch:any) => (
              <LaunchCard key={launch.flight_number} launch={launch} />
            ))}
          </div>
        </div>
      </div>
      <div className="text-center font-bold">
  <h6>Developed By Jiyan Patil</h6>
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Link href="https://www.linkedin.com/in/jiyan-patil-8a85561a5/" target="_blank" rel="noopener noreferrer">
      <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/linkedin.png" alt="LinkedIn" />
      
    {/* </a> */}
    </Link>
    <Link href="https://github.com/jiyanpatil07" target="_blank" rel="noopener noreferrer">
      <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/github.png" alt="LinkedIn" />
      
    {/* </a> */}
    </Link>
    
  </div>
</div>
    </div>
  );
}

export default Home;
