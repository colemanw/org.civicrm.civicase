/* eslint-env jasmine */

((_) => {
  describe('workflow list', () => {
    let $q, $controller, $rootScope, $scope, CaseTypesMockData,
      civicaseCrmApiMock, WorkflowListActionItems, CaseManagementWorkflow,
      WorkflowListColumns;

    const testFilters = [
      {
        filterIdentifier: 'test1',
        defaultValue: true,
        onlyVisibleForInstance: 'case_management',
        templateUrl: '~/test.html'
      },
      {
        filterIdentifier: 'test2',
        defaultValue: '',
        onlyVisibleForInstance: 'applicant_management',
        templateUrl: '~/test2.html'
      }
    ];

    describe('basic tests', () => {
      beforeEach(() => {
        injectModulesAndDependencies();
        CaseManagementWorkflow.getWorkflowsList.and.returnValue($q.resolve(
          CaseTypesMockData.getSequential()
        ));
        initController();
      });

      it('hides the empty message before case types are loaded', () => {
        expect($scope.isLoading).toBe(true);
      });

      describe('after case types are loaded', () => {
        beforeEach(() => {
          $scope.$digest();
        });

        it('shows the results after case types is loaded', () => {
          expect($scope.isLoading).toBe(false);
        });

        it('displays the list of fetched workflows', () => {
          expect($scope.workflows).toEqual(CaseTypesMockData.getSequential());
        });

        it('displays the action items dropdown', () => {
          expect($scope.actionItems).toEqual(WorkflowListActionItems);
        });

        it('displays the columns', () => {
          expect($scope.tableColumns).toEqual(WorkflowListColumns);
        });

        it('displays the filters only meant for current instance', () => {
          expect($scope.filters).toEqual([testFilters[0]]);
        });

        it('displays the filters default values', () => {
          expect($scope.selectedFilters).toEqual({ test1: true });
        });
      });
    });

    describe('when list refresh event is fired', () => {
      beforeEach(() => {
        injectModulesAndDependencies();
        CaseManagementWorkflow.getWorkflowsList.and.returnValue($q.resolve(
          CaseTypesMockData.getSequential()
        ));
        initController();
        $scope.$digest();
        $scope.workflows = [];
        $rootScope.$broadcast('workflow::list::refresh');
        $scope.$digest();
      });

      it('fetches the case types for the current case type category', () => {
        expect(CaseManagementWorkflow.getWorkflowsList).toHaveBeenCalled();
      });

      it('refreshes the workflows list', () => {
        expect($scope.workflows).toEqual(CaseTypesMockData.getSequential());
      });
    });

    /**
     * Initialises a spy module by hoisting the filters provider.
     */
    function initSpyModule () {
      angular.module('civicase.spy', ['civicase-base'])
        .config((WorkflowListFiltersProvider) => {
          WorkflowListFiltersProvider.addItems(testFilters);
        });
    }

    /**
     * Injects modules and dependencies.
     */
    function injectModulesAndDependencies () {
      initSpyModule();

      module('workflow', 'civicase.data', 'civicase.spy', ($provide) => {
        civicaseCrmApiMock = jasmine.createSpy('civicaseCrmApi');

        $provide.value('civicaseCrmApi', civicaseCrmApiMock);
      });

      inject((_$q_, _$controller_, _$rootScope_, _CaseTypesMockData_,
        _WorkflowListActionItems_, _CaseManagementWorkflow_,
        _WorkflowListColumns_) => {
        $q = _$q_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        WorkflowListActionItems = _WorkflowListActionItems_;
        WorkflowListColumns = _WorkflowListColumns_;
        CaseTypesMockData = _CaseTypesMockData_;
        CaseManagementWorkflow = _CaseManagementWorkflow_;

        spyOn(CaseManagementWorkflow, 'getWorkflowsList');
      });
    }

    /**
     * Initializes the contact case tab case details controller.
     */
    function initController () {
      $scope = $rootScope.$new();
      $scope.caseTypeCategory = 'Cases';

      $controller('workflowListController', { $scope: $scope });
    }
  });
})(CRM._);
