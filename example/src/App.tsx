import { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  HTMLText,
  type DetectedContentType,
} from 'react-native-fabric-html-text';

// Debug mode: adds visible borders around HTMLText components
const DEBUG_BOUNDS = true;

export default function App(): React.JSX.Element {
  const [lastLinkPressed, setLastLinkPressed] = useState<string | null>(null);
  const [expandedText, setExpandedText] = useState(false);
  const [numberOfLinesDemo, setNumberOfLinesDemo] = useState(2);

  const handleLinkPress = useCallback(
    (url: string, type: DetectedContentType) => {
      setLastLinkPressed(`${url} (${type})`);
      Alert.alert('Link Pressed', `URL: ${url}\nType: ${type}`);
    },
    []
  );

  const toggleExpanded = useCallback(() => {
    setExpandedText((prev) => !prev);
  }, []);

  const cycleNumberOfLines = useCallback(() => {
    setNumberOfLinesDemo((prev) => {
      if (prev === 0) return 1;
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      return 0; // 0 = no limit
    });
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.sectionTitle}>Basic Formatting</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<h1>Hello World</h1><p>This is <strong>bold</strong> and <em>italic</em> text.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          testID="basic-formatting"
        />
      </View>

      <Text style={styles.sectionTitle}>Links</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html='<p>Visit <a href="https://example.com">Example.com</a> or <a href="https://react-native.dev">React Native Docs</a>.</p>'
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          onLinkPress={handleLinkPress}
          testID="links-example"
        />
      </View>
      {lastLinkPressed && (
        <Text style={styles.linkStatus} testID="last-link-pressed">
          Last link: {lastLinkPressed}
        </Text>
      )}

      <Text style={styles.sectionTitle}>Unordered List</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<ul><li>First item</li><li>Second item</li><li>Third item</li></ul>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          testID="unordered-list"
        />
      </View>

      <Text style={styles.sectionTitle}>Ordered List</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html="<ol><li>Step one</li><li>Step two</li><li>Step three</li></ol>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          testID="ordered-list"
        />
      </View>

      <Text style={styles.sectionTitle}>Nested Lists</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<ul><li>Parent item<ul><li>Child item 1</li><li>Child item 2</li></ul></li><li>Another parent</li></ul>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          testID="nested-lists"
        />
      </View>

      <Text style={styles.sectionTitle}>Custom Tag Styles</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html="<p>Normal text with <strong>custom red bold</strong> and <em>custom blue italic</em>.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          tagStyles={{
            strong: { color: '#CC0000' },
            em: { color: '#0066CC' },
          }}
          testID="custom-tag-styles"
        />
      </View>

      <Text style={styles.sectionTitle}>TagStyles: Full TextStyle Parity</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<p>Normal <strong>LARGER BOLD RED</strong> and <em>italic blue underlined</em> text.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          tagStyles={{
            strong: {
              color: '#CC0000',
              fontSize: 20,
              fontWeight: 'bold',
            },
            em: {
              color: '#0066CC',
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            },
          }}
          testID="tagstyles-full-parity"
        />
      </View>

      <Text style={styles.sectionTitle}>TagStyles: Text Decoration</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html="<p>Normal <strong>strikethrough</strong> and <em>underlined</em> text.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          tagStyles={{
            strong: {
              textDecorationLine: 'line-through',
              color: '#666666',
            },
            em: {
              textDecorationLine: 'underline',
              color: '#007AFF',
            },
          }}
          testID="tagstyles-decoration"
        />
      </View>

      <Text style={styles.sectionTitle}>Native HTML Text Decoration</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<p>Text with <u>underline tag</u> and <s>strikethrough tag</s> using native HTML.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          testID="native-text-decoration"
        />
      </View>

      <Text style={styles.sectionTitle}>Links with Custom Styles</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html='<p>Click <a href="https://styled-link.com">this styled link</a> to test.</p>'
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          onLinkPress={handleLinkPress}
          tagStyles={{
            a: { color: '#9900CC' },
          }}
          testID="styled-links"
        />
      </View>

      <Text style={styles.sectionTitle}>Phone Number Detection</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<p>555-123-4567 is our support line.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          detectPhoneNumbers
          onLinkPress={handleLinkPress}
          testID="phone-detection"
        />
      </View>

      <Text style={styles.sectionTitle}>Email Detection</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html="<p>Contact support@example.com or sales@company.org for help.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          detectEmails
          onLinkPress={handleLinkPress}
          testID="email-detection"
        />
      </View>

      <Text style={styles.sectionTitle}>All Detection Types</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html='<p>Visit <a href="https://example.com">our site</a>, call 555-987-6543, or email info@test.com.</p>'
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          detectLinks
          detectPhoneNumbers
          detectEmails
          onLinkPress={handleLinkPress}
          testID="all-detection"
        />
      </View>

      <Text style={styles.sectionTitle}>
        XSS Security Test (Should NOT be clickable)
      </Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html='<p>Malicious: <a href="javascript:alert(1)">javascript link</a> and <a href="data:text/html,<script>alert(2)</script>">data link</a> should be blocked.</p>'
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          onLinkPress={handleLinkPress}
          testID="xss-security-test"
        />
      </View>

      <Text style={styles.sectionTitle}>Complex Content</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
        <HTMLText
          html={`
            <h2>Feature Overview</h2>
            <p>The <strong>HTMLText</strong> component supports:</p>
            <ul>
              <li><strong>Links</strong> - Tappable with callbacks</li>
              <li><em>Lists</em> - Ordered and unordered</li>
              <li>Custom <a href="https://styles.example">styling</a></li>
            </ul>
            <p>For more info, visit <a href="https://docs.example.com">our documentation</a>.</p>
          `}
          style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
          onLinkPress={handleLinkPress}
          tagStyles={{
            h2: { color: '#333333', fontSize: 20 },
            a: { color: '#007AFF' },
          }}
          includeFontPadding={false}
          testID="complex-content"
        />
      </View>

      <Text style={styles.sectionTitle}>numberOfLines - Expand/Collapse</Text>
      <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
        <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
          <HTMLText
            html="<p>This is a <strong>longer paragraph</strong> that demonstrates the <em>numberOfLines</em> feature. When collapsed, only the first 2 lines are shown with an ellipsis. Tap to expand or collapse this text. The height change is animated smoothly over 0.3 seconds using an ease-in-out timing curve.</p>"
            style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
            numberOfLines={expandedText ? 0 : 2}
            animationDuration={0.3}
            testID="expand-collapse-demo"
          />
        </View>
        <Text style={styles.tapHint}>
          Tap to {expandedText ? 'collapse' : 'expand'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>numberOfLines - Dynamic Control</Text>
      <TouchableOpacity onPress={cycleNumberOfLines} activeOpacity={0.7}>
        <View style={DEBUG_BOUNDS ? styles.debugContainer2 : undefined}>
          <HTMLText
            html="<p>This example cycles through different <strong>numberOfLines</strong> values: 1, 2, 3, and unlimited (0). Each tap changes the line limit and the height animates smoothly. The ellipsis is automatically added when content is truncated. This is useful for preview cards, article summaries, or any content that needs to be expandable.</p>"
            style={[styles.text, DEBUG_BOUNDS && styles.debugText2]}
            numberOfLines={numberOfLinesDemo}
            animationDuration={0.2}
            testID="dynamic-lines-demo"
          />
        </View>
        <Text style={styles.tapHint}>
          numberOfLines:{' '}
          {numberOfLinesDemo === 0 ? 'unlimited' : numberOfLinesDemo} (tap to
          change)
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>numberOfLines - Instant Change</Text>
      <View style={DEBUG_BOUNDS ? styles.debugContainer1 : undefined}>
        <HTMLText
          html="<p>This text has <em>numberOfLines={1}</em> with <strong>animationDuration={0}</strong>, meaning height changes are instant with no animation. Only one line is shown.</p>"
          style={[styles.text, DEBUG_BOUNDS && styles.debugText1]}
          numberOfLines={1}
          animationDuration={0}
          testID="instant-truncation"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 16,
    paddingTop: 60,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginTop: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  linkStatus: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  tapHint: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Debug styles - outer container (cyan border)
  debugContainer1: {
    borderWidth: 2,
    borderColor: '#00CED1', // Dark cyan
    borderStyle: 'solid',
  },
  debugContainer2: {
    borderWidth: 2,
    borderColor: '#FF6347', // Tomato red
    borderStyle: 'solid',
  },
  // Debug styles - inner HTMLText (light backgrounds)
  debugText1: {
    backgroundColor: 'rgba(0, 206, 209, 0.15)', // Light cyan
  },
  debugText2: {
    backgroundColor: 'rgba(255, 99, 71, 0.15)', // Light tomato
  },
});
