// Out-of-tree platforms on React Native < 0.87 ship only `InitializeCore`
try {
  require('react-native/setup-env');
} catch {
  require('react-native/Libraries/Core/InitializeCore');
}
