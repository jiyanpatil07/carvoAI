import Image from "next/image";
import { Alert } from "flowbite-react";
import { useState } from "react";
import { Navbar } from "flowbite-react";
import { useRouter } from 'next/router';

export async function getServerSideProps() {
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
    <div className="max-w-md bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <a href={launch.links.article_link} target="_blank" rel="noopener noreferrer">
        <img className="rounded-t-lg" src={launch.links.mission_patch} alt={launch.mission_name} />
      </a>
      <div className="p-4">
        <a href={launch.links.article_link} target="_blank" rel="noopener noreferrer">
          <h5 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
            {launch.mission_name}
          </h5>
        </a>
        <p className="mb-3 text-gray-700 dark:text-gray-400">{launch.details}</p>
        <p className="mb-1 text-gray-700 dark:text-gray-400">Mission IDs: {launch.mission_id.join(", ")}</p>
        <p className="mb-1 text-gray-700 dark:text-gray-400">Launch Year: {launch.launch_year}</p>
        <p className="mb-1 text-gray-700 dark:text-gray-400">
          Successful Launch: {launch.launch_success ? "Yes" : "No"}
        </p>
        {launch.rocket.first_stage.cores[0].land_success !== null && (
          <p className="mb-1 text-gray-700 dark:text-gray-400">
            Successful Landing: {launch.rocket.first_stage.cores[0].land_success ? "Yes" : "No"}
          </p>
        )}
        <a
          href={launch.links.article_link}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg mt-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
        </a>
      </div>
    </div>
  );
}

function Home({ launches }: { launches: any }) {
  const router = useRouter();
  const { query } = router;

  const selectedYear = query.year as string | undefined;
  const successfulLaunch = query.launch === 'true' ? true : query.launch === 'false' ? false : undefined;
  const successfulLanding = query.landing === 'true' ? true : query.landing === 'false' ? false : undefined;

  const handleYearFilter = (year: string) => {
    const newQuery = { ...query, year };
    router.push({ pathname: '/', query: newQuery });
  };

  const handleLaunchFilter = (value: boolean | undefined) => {
    const newQuery = { ...query };
    if (value === true) {
      newQuery.launch = 'true';
    } else if (value === false) {
      newQuery.launch = 'false';
    } else {
      delete newQuery.launch;
    }
    router.push({ pathname: '/', query: newQuery });
  };

  const handleLandingFilter = (value: boolean | undefined) => {
    const newQuery = { ...query };
    if (value === true) {
      newQuery.landing = 'true';
    } else if (value === false) {
      newQuery.landing = 'false';
    } else {
      delete newQuery.landing;
    }
    router.push({ pathname: '/', query: newQuery });
  };

  const filteredLaunches = launches.filter((launch: any) => {
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

  const years = Array.from({ length: 15 }, (_, index) => (2006 + index).toString());

  return (
    <>
      <Navbar fluid={true} rounded={true}>
        <Navbar.Brand href="https://flowbite.com/">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            SpaceX
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link href="/navbars" active={true}>
            Home
          </Navbar.Link>
          <Navbar.Link href="/navbars">About</Navbar.Link>
          <Navbar.Link href="/navbars">Services</Navbar.Link>
          <Navbar.Link href="/navbars">Pricing</Navbar.Link>
          <Navbar.Link href="/navbars">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="bg-gray-100 dark:bg-gray-900">
        <main className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Welcome to Jiyan</h1>

          <div className="flex flex-wrap gap-3 mb-8">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearFilter(year)}
                className={`bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 text-sm font-medium rounded-lg px-4 py-2 ${
                  selectedYear === year ? 'bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 text-white' : ''
                }`}
              >
                Launch Year {year}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mb-4">
            {/* Buttons for filtering by Successful Launch */}
            <button
              onClick={() => handleLaunchFilter(true)}
              className={`bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 text-white text-sm font-medium rounded-lg px-4 py-2 ${
                successfulLaunch === true ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300' : ''
              }`}
            >
              Successful Launch
            </button>
            <button
              onClick={() => handleLaunchFilter(false)}
              className={`bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-red-300 text-white text-sm font-medium rounded-lg px-4 py-2 ${
                successfulLaunch === false ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300' : ''
              }`}
            >
              Unsuccessful Launch
            </button>
          </div>

          <div className="flex gap-4 mb-8">
            {/* Buttons for filtering by Successful Landing */}
            <button
              onClick={() => handleLandingFilter(true)}
              className={`bg-green-400 hover:bg-green-500 focus:ring-4 focus:ring-green-300 text-white text-sm font-medium rounded-lg px-4 py-2 ${
                successfulLanding === true ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300' : ''
              }`}
            >
              Successful Landing
            </button>
            <button
              onClick={() => handleLandingFilter(false)}
              className={`bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-red-300 text-white text-sm font-medium rounded-lg px-4 py-2 ${
                successfulLanding === false ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300' : ''
              }`}
            >
              Unsuccessful Landing
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLaunches.map((launch: any) => (
              <LaunchCard key={launch.flight_number} launch={launch} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;
