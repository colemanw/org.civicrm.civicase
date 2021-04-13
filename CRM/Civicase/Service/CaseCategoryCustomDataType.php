<?php

/**
 * Helps to create the custom data option value for a case category.
 */
class CRM_Civicase_Service_CaseCategoryCustomDataType {

  /**
   * Creates the Custom data type option value for case category.
   *
   * Without this value, it will not be possible to set the case category value
   * in the `extends_entity_column_id` column of the custom group table as the
   * column must contain valid values from the custom_data_type option group.
   *
   * @param array $caseTypeCategory
   *   Case Category data.
   */
  public function create(array $caseTypeCategory) {
    $result = $this->getCustomDataOptionValue($caseTypeCategory['name']);

    if ($result['count'] > 0) {
      return;
    }

    $caseCategoryOptions = CRM_Core_OptionGroup::values('case_type_categories', TRUE, FALSE, TRUE, NULL, 'name');

    try {
      civicrm_api3('OptionValue', 'create', [
        'option_group_id' => 'custom_data_type',
        'name' => $caseTypeCategory['name'],
        'label' => $caseTypeCategory['label'],
        'value' => $caseCategoryOptions[$caseTypeCategory['name']],
        'description' => NULL,
        'is_active' => TRUE,
        'is_reserved' => TRUE,
      ]);
    }
    catch (Exception $e) {

    }

  }

  /**
   * Creates the Custom data type option value for case category.
   *
   * @param array $caseTypeCategory
   *   Case Category data.
   */
  public function delete(array $caseTypeCategory) {
    $result = $this->getCustomDataOptionValue($caseTypeCategory['name']);

    if ($result['count'] == 0) {
      return;
    }

    CRM_Core_BAO_OptionValue::del($result['values'][0]['id']);
  }

  /**
   * Return Custom Data type option value.
   *
   * @param string $caseCategoryName
   *   Case Category Name.
   *
   * @return array
   *   Custom data type option value.
   */
  private function getCustomDataOptionValue($caseCategoryName) {
    $result = civicrm_api3('OptionValue', 'get', [
      'sequential' => 1,
      'name' => $caseCategoryName,
      'option_group_id' => 'custom_data_type',
    ]);

    return $result;
  }

}
