// Minimal store/rootReducer to fix build issues
export interface RootState {
  auth: {
    user: any;
    creatingUserData: boolean;
  };
}