import { test } from '@playwright/test';
import { EnvAquaRestConfig } from '../aquaAPI/envAquaRestConfig';
import { ApiTestExecutionNew, 
         ApiTestStepExecutionStepType, 
         ApiTestStepExecutionUpdateStatus, 
         TestExecutionClient } from '../aquaAPI/src/api/aqua';


export class TestBase{}

test.afterEach(async ({ page }) => {
  console.log(`Finished ${test.info().title} with status ${test.info().status}`);

  if (test.info().status !== test.info().expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);

  
    const restConfig = new EnvAquaRestConfig();
    const client = new TestExecutionClient(restConfig.url, { fetch });
    const testCaseId = Number(test.info().title);

    let stepStatus = ApiTestStepExecutionUpdateStatus.Pass;
    if (test.info().status === 'failed') {
      stepStatus = ApiTestStepExecutionUpdateStatus.Failed;
    } else if (test.info().status != 'passed') {
      throw new Error('no such status for test case execution');
    }
    
    const executionData = {
      Guid: undefined,
      TestCaseId: testCaseId,
      TestCaseName: undefined,
      Finalize: false,
      ValueSetName: undefined,
      TestScenarioInfo: undefined,
      Steps: [
        {
          Index: 1,
          Name: 'Step 1',
          StepType: ApiTestStepExecutionStepType.Step,
          Status: stepStatus,
        },
      ],
      TestedVersion: undefined,
      ExecutionDuration: undefined,
      AttachedLabels: undefined,
      CustomFields: undefined,
      Attachments: undefined
    } as unknown as ApiTestExecutionNew;
  
    await client.create([executionData]);
    
});
