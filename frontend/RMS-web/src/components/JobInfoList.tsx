import React, { useEffect, useState } from 'react';
import JobInfoCard from './JobInfoCard';
import type { Job } from '../commonInterface/JobListResponse.interface';
import { Button, Divider } from '@mui/material';
import appGlobal from '../utils/AppGlobal';
import { HTTPHelper } from '../utils/HTTPHelper';
import UnderlineLink from './UnderlineLink';

interface ApplyResponse {
  result: boolean,
  errorCode?: string,
  message?: string;
}

interface JobListProps {
  jobs: Job[],
  currentPage: number,
  totalPage: number,
  currentUserType: string,
  onPageChanged: (page: number) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, currentPage, totalPage, currentUserType, onPageChanged }) => {
  const [currentJob, setCurrentJob] = useState<Job>({} as Job);
  const handleJob = (job: Job): void => {
    setCurrentJob(job);
  }

  const handleApply = async () => {
    const jobId = currentJob.id;
    console.log("Applying for job with ID:", jobId);
    const response = await HTTPHelper.call<ApplyResponse>(
      `${appGlobal.endpoint_job}/applyJob`,
      'POST',
      { jobId }
    );

    console.log(response);
    if (response.result) {
      alert("You have applied for the job: " + currentJob?.jobTitle);
    } else {
      alert("Failed to apply for the job: " + currentJob?.jobTitle + "\nReason: " + response.message);
    }
  }

  useEffect(() => {
    // Show first job by default
    if (jobs.length > 0)
      setCurrentJob(jobs[0]);
  }, []);

  return (
    <div className='flex flex-col md:flex-row w-full h-full'>
      <div className="w-full md:w-1/3 h-full overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Up pagination */}
            <div className='flex flex-row justify-center'>
            <Button variant='contained' style={{margin: 3}} onClick={() => onPageChanged(currentPage-1)} disabled={currentPage == 0}>{'<'} Prev</Button>

            {currentPage - 1 > 0 && <Button variant='outlined' style={{margin: 3}} onClick={()=> onPageChanged(currentPage-2)}>{currentPage-1}</Button>}
            {currentPage > 0 && <Button variant='outlined' style={{margin: 3}} onClick={()=> onPageChanged(currentPage-1)}>{currentPage}</Button>}
            <Button variant='outlined' style={{margin: 3, textDecoration: 'underline'}}>{currentPage + 1}</Button>
            
            {currentPage < totalPage - 1 && <Button variant='outlined' style={{margin: 3}} onClick={() => onPageChanged(currentPage+1)}>{currentPage + 2}</Button>}
            {currentPage + 1 < totalPage - 1 && <Button variant='outlined' style={{margin: 3}} onClick={() => onPageChanged(currentPage+2)}>{currentPage + 3}</Button>}
            <Button variant='contained' style={{margin: 3}} onClick={() => onPageChanged(currentPage+1)} disabled={currentPage == totalPage - 1}>Next {'>'}</Button>
          </div>

          {jobs.map((job, index) => (
            <JobInfoCard
              key={index}
              job={job}
              onClick={() => handleJob(job)}
              isSelected={currentJob.id === job.id}
            />
          ))}

          {/* Down pagination */}
          <div className='flex flex-row justify-center'>
            <Button variant='contained' style={{margin: 3}} onClick={() => onPageChanged(currentPage-1)} disabled={currentPage == 0}>{'<'} Prev</Button>

            {currentPage - 1 > 0 && <Button variant='outlined' style={{margin: 3}} onClick={()=> onPageChanged(currentPage-2)}>{currentPage-1}</Button>}
            {currentPage > 0 && <Button variant='outlined' style={{margin: 3}} onClick={()=> onPageChanged(currentPage-1)}>{currentPage}</Button>}
            <Button variant='outlined' style={{margin: 3, textDecoration: 'underline'}}>{currentPage + 1}</Button>
            
            {currentPage < totalPage - 1 && <Button variant='outlined' style={{margin: 3}} onClick={() => onPageChanged(currentPage+1)}>{currentPage + 2}</Button>}
            {currentPage + 1 < totalPage - 1 && <Button variant='outlined' style={{margin: 3}} onClick={() => onPageChanged(currentPage+2)}>{currentPage + 3}</Button>}
            <Button variant='contained' style={{margin: 3}} onClick={() => onPageChanged(currentPage+1)} disabled={currentPage == totalPage - 1}>Next {'>'}</Button>
          </div>
        </div>
      </div>
      <div className='border-l-4 border-gray-200 pl-4 my-4'>
        <h1 className='text-3xl'>{currentJob?.jobTitle}</h1>
        <Divider/>
        <h2>Posted on: {currentJob?.jobPostedDate}</h2>
        <h2>Mode: {currentJob?.belongingEmploymentType?.name}</h2>
        <h2>Department: {currentJob?.belongingDepartment?.name}</h2>
        <h2>Description: {currentJob?.jobDescription}</h2>
        <h2>Requirements: {currentJob.jobRequirement}</h2>
        <Divider/>
        {currentUserType === '' && <UnderlineLink className="text-green-700" href="/login">Login to apply</UnderlineLink>}
        {currentUserType === appGlobal.userType_APPLICANT && 
        <Button variant='contained' 
          color='primary' 
          style={{marginTop: 4}} 
          onClick={() => handleApply()}>Apply</Button>}
      </div>
    </div>
  );
};

export default JobList;