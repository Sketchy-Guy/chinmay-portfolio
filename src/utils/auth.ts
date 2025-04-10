
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates or updates admin status for the specified user
 */
export const ensureAdminStatus = async (email: string) => {
  try {
    // Get user data from the current session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return {
        success: false,
        message: "No authenticated user found."
      };
    }
    
    // Special case for chinmaykumarpanda004@gmail.com - direct admin
    if (email === 'chinmaykumarpanda004@gmail.com') {
      // Try to create/update auth_users record for this user
      const { error } = await supabase
        .from('auth_users')
        .upsert(
          { 
            id: user.id,
            is_admin: true 
          },
          { onConflict: 'id' }
        );
      
      if (error) {
        console.error("Error setting admin status:", error);
        return {
          success: false,
          message: `Database error: ${error.message}`
        };
      }
      
      return {
        success: true,
        message: "Admin status set successfully."
      };
    }
    
    return {
      success: false,
      message: "User is not authorized for admin access."
    };
  } catch (error: any) {
    console.error("Auth error:", error);
    return {
      success: false,
      message: error.message || "Unknown error occurred"
    };
  }
};
