package com.academic.RequirementManagementSystem.Security;

public final class SecurityConstants {
	public static final String IS_DEFAULT = "hasRole('DEFAULT')";
	public static final String IS_STUDENT = "hasRole('STUDENT')";
	public static final String IS_STAFF = "hasRole('STAFF')";
	public static final String IS_STAFF_OR_STUDENT = "hasAnyRole('STAFF','STUDENT')";
	public static final String HAS_HR = "hasRole('HR')";
	public static final String HAS_HR_OR_STAFF = "hasAnyRole('HR','STAFF')";
	public static final String HAS_ADMIN = "hasRole('ADMIN')";
	public static final String HAS_ADMIN_OR_HR = "hasAnyRole('ADMIN', 'HR')";
	public static final String HAS_NOT_DEFAULT = "!hasRole('DEFAULT')";
	public static final String HAS_STAFF_HR_ADMIN = "hasAnyRole('ADMIN', 'HR', 'STAFF')";
	public static final String HAS_HR_OR_STAFF_OR_ADMIN = "hasAnyRole('HR', 'STAFF', 'ADMIN')";
}
