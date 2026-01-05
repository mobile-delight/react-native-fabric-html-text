#import <UIKit/UIKit.h>
#import "FabricHTMLCoreTextView.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Accessibility element representing a single link within FabricHTMLCoreTextView.
 *
 * This element exposes individual links to VoiceOver as focusable, actionable elements.
 * Each link gets its own accessibility frame, label, hint, and can be activated.
 *
 * WCAG 2.1 Level AA Compliance:
 * - 2.4.4 Link Purpose: Label includes link text
 * - 4.1.2 Name, Role, Value: Exposes link trait and activation
 */
@interface FabricHTMLLinkAccessibilityElement : UIAccessibilityElement

/**
 * Zero-based index of this link in the parent view's link array.
 */
@property (nonatomic, assign, readonly) NSUInteger linkIndex;

/**
 * Total number of links in the parent view (for "link X of Y" announcement).
 */
@property (nonatomic, assign, readonly) NSUInteger totalLinkCount;

/**
 * The URL this link points to.
 */
@property (nonatomic, copy, readonly) NSURL *url;

/**
 * The type of content this link represents (link, email, phone).
 */
@property (nonatomic, assign, readonly) HTMLDetectedContentType contentType;

/**
 * The visible text of the link.
 */
@property (nonatomic, copy, readonly) NSString *linkText;

/**
 * Initialize a new link accessibility element.
 *
 * @param container The parent accessibility container (FabricHTMLCoreTextView)
 * @param linkIndex Zero-based index of this link
 * @param totalLinkCount Total number of links in the container
 * @param url The URL this link points to
 * @param contentType The type of content (link, email, phone)
 * @param linkText The visible text of the link
 * @param frame The accessibility frame in screen coordinates
 */
- (instancetype)initWithAccessibilityContainer:(id)container
                                     linkIndex:(NSUInteger)linkIndex
                                totalLinkCount:(NSUInteger)totalLinkCount
                                           url:(NSURL *)url
                                   contentType:(HTMLDetectedContentType)contentType
                                      linkText:(NSString *)linkText
                                         frame:(CGRect)frame;

@end

NS_ASSUME_NONNULL_END
