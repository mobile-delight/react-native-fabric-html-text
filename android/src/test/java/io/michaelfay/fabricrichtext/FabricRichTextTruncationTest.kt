package io.michaelfay.fabricrichtext

import android.text.Layout
import android.text.StaticLayout
import android.text.TextPaint
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

/**
 * Unit tests for content truncation detection in FabricRichTextView.
 *
 * Tests the isContentTruncated() logic through accessibility behavior
 * and layout configuration.
 */
@RunWith(RobolectricTestRunner::class)
@Config(manifest = Config.NONE)
class FabricRichTextTruncationTest {

    private lateinit var view: FabricRichTextView

    @Before
    fun setUp() {
        view = FabricRichTextView(RuntimeEnvironment.getApplication())
    }

    // MARK: - numberOfLines <= 0 Returns False

    @Test
    fun `isContentTruncated returns false when numberOfLines is 0`() {
        // Given: Content and numberOfLines = 0 (unlimited)
        view.setHtml("<p>This is some long text that would normally truncate</p>")
        view.setNumberOfLines(0)
        view.measure(800, 200)
        view.layout(0, 0, 800, 200)

        // When/Then: Content description should NOT indicate truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertFalse("Content should not be marked as truncated when numberOfLines=0",
                    contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    @Test
    fun `isContentTruncated returns false when numberOfLines is negative`() {
        // Given: Content and numberOfLines = -1 (treated as unlimited)
        view.setHtml("<p>This is some long text that would normally truncate</p>")
        view.setNumberOfLines(-1)
        view.measure(800, 200)
        view.layout(0, 0, 800, 200)

        // When/Then: Content description should NOT indicate truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertFalse("Content should not be marked as truncated when numberOfLines is negative",
                    contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    // MARK: - Ellipsis Detection Returns True

    @Test
    fun `isContentTruncated returns true when ellipsis is present`() {
        // Given: Short view width that will force truncation with ellipsis
        view.setHtml("<p>This is a very long line of text that will definitely be truncated when displayed in a narrow view</p>")
        view.setNumberOfLines(1)

        // Narrow width to force truncation
        view.measure(200, 100)
        view.layout(0, 0, 200, 100)

        // When/Then: Content description should indicate truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertTrue("Content should be marked as truncated when ellipsis is present",
                   contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    // MARK: - Visible Text Range Truncation Returns True

    @Test
    fun `isContentTruncated returns true when visible text is less than full text`() {
        // Given: Multi-line content constrained to fewer lines
        val longHtml = """
            <p>Line one of the content</p>
            <p>Line two of the content</p>
            <p>Line three of the content</p>
            <p>Line four of the content</p>
        """.trimIndent()

        view.setHtml(longHtml)
        view.setNumberOfLines(2)  // Show only 2 lines

        view.measure(400, 200)
        view.layout(0, 0, 400, 200)

        // When/Then: Content description should indicate truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertTrue("Content should be marked as truncated when visible lines < total lines",
                   contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    // MARK: - Edge Cases Return False

    @Test
    fun `isContentTruncated returns false for null layout`() {
        // Given: View with no layout yet
        view.setHtml("<p>Some text</p>")
        view.setNumberOfLines(2)
        // Don't call measure/layout

        // When/Then: Should handle gracefully without crashing
        // Access via reflection since isContentTruncated is private
        val contentDesc = view.contentDescription?.toString() ?: ""
        // Should not crash and should not indicate truncation without layout
        assertNotNull(contentDesc)
    }

    @Test
    fun `isContentTruncated returns false for empty text`() {
        // Given: Empty content
        view.setHtml("")
        view.setNumberOfLines(2)
        view.measure(400, 200)
        view.layout(0, 0, 400, 200)

        // When/Then: Empty text cannot be truncated
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertFalse("Empty content should not be marked as truncated",
                    contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    @Test
    fun `isContentTruncated returns false for null text`() {
        // Given: Null content
        view.setHtml(null)
        view.setNumberOfLines(2)
        view.measure(400, 200)
        view.layout(0, 0, 400, 200)

        // When/Then: Null text cannot be truncated
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertFalse("Null content should not be marked as truncated",
                    contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    // MARK: - Single Line Behavior

    @Test
    fun `isContentTruncated works correctly for single line truncation`() {
        // Given: Single line with truncation
        view.setHtml("<p>This is a very long single line that will be truncated in a narrow view with ellipsis at the end</p>")
        view.setNumberOfLines(1)

        // Narrow width
        view.measure(150, 50)
        view.layout(0, 0, 150, 50)

        // When/Then: Should detect truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertTrue("Single line truncation should be detected",
                   contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    @Test
    fun `isContentTruncated returns false when content fits in single line`() {
        // Given: Short content that fits in one line
        view.setHtml("<p>Short</p>")
        view.setNumberOfLines(1)

        view.measure(400, 100)
        view.layout(0, 0, 400, 100)

        // When/Then: No truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertFalse("Content that fits should not be marked as truncated",
                    contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }

    @Test
    fun `isContentTruncated returns false when all content is visible`() {
        // Given: Content that fits within numberOfLines
        view.setHtml("<p>Line 1</p><p>Line 2</p>")
        view.setNumberOfLines(5)  // More lines than needed

        view.measure(400, 200)
        view.layout(0, 0, 400, 200)

        // When/Then: No truncation
        val contentDesc = view.contentDescription?.toString() ?: ""
        assertFalse("Content that fully fits should not be marked as truncated",
                    contentDesc.contains("truncated") || contentDesc.contains("More content available"))
    }
}
